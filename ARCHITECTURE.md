# XMS architecture

Reference for how this codebase is meant to work. Intent comes from `README.md` (Cezar Lucan, aws-dms.com, GPL, started 2010). The pipeline below is what `includes/Xms/Core/Xms.php` actually does.

XMS is a PHP content-management framework. An application is an XML document. PHP and JavaScript live inside that document as processing instructions and run against the DOM. The engine is event-based and adds observable instance properties and methods on top of PHP's DOM, which does not allow them natively.

Requirements stated by the author: PHP 5.4+ and the `xsl` extension. The class constant is still `Xms::VERSION = 4.20` (2015-05-03). The README already describes the 5.x filter model. Uncommitted work targets PHP 8 (`create_function` polyfill in `defaults.php`, null-safe console logging).

## Request path

```
browser
  -> urlhandler.php          only when mod_rewrite is on; streams a real file or falls through
  -> index.php
       session_start()
       defaults.php          constants, autoload, xsl check
       new Xms\Core\Xms()    loads access, config, router, lang, parsers; router picks the app
       $XMS->run()
       echo $XMS->get()      XSLT via @outputxsl, or raw client XML
```

`Xms` can also be constructed with an options array (`XMS_INPUT`, `XMS_RESOURCE_ROUTER`, `XMS_RESOURCE_CONFIG`, `XMS_RESOURCE_ACCESS`, `XMS_RESOURCE_LANG`, `XMS_RESOURCE_PARSERS`) so it can run as a standalone engine, not only from the web request.

`xmlserver.php` is not part of page rendering. It is the file open/save backend for Designer.

## What an application is

The unit of work is an `<app>` document, normally under `templates/`. `config.xml` names apps (`path`, `ALIAS`, `DESCRIPTION`). The router decides which file is loaded.

```xml
<app outputxsl="xsl/aws2html5.xsl">
  <remotetemplate/>          <!-- mirror an existing app, then patch it -->
  <use/>                     <!-- pull another XMS app into this one -->
  <name/>
  <init>                     <!-- application setup; prefer $el->topmost() over globals -->
    <?aws /* php, $el is the init element */ ?>
  </init>
  <client>                   <!-- the document the user sees; directives run here -->
    <header><?js /* becomes a script element */ ?></header>
    <content>
      <?php /* $el is the parent element of this PI */ ?>
      <case>...</case>
      <import source="..." xpath="..."/>
    </content>
  </client>
  <templates/>               <!-- local fragments import can pull from -->
  <filters/>                 <!-- xpath, domiterator, import; run after client directives -->
  <parsers/>                 <!-- optional per-app parsers; rarely used -->
</app>
```

`@outputxsl` selects the stylesheet (`xsl/aws2html.xsl`, `xsl/aws2html5.xsl`, and the other sheets in `xsl/`). `@outputdisabled="TRUE"` suppresses `get()`.

Two PHP dialects:

- `<?aws ...?>` is engine code: router models, access rules, init, filter callbacks, parser callbacks. Compiled with `create_function` (`Xms::_create_function`).
- `<?php ...?>` is a client directive. `$el` is the **parent element** of the PI, not the PI. A returned string or `DOMNode` replaces the PI. `<?js ...?>` is rewritten to a `<script>` element.

`$el->topmost()` walks `parentNode` up to the `Xms` engine.

## Engine pipeline

`Xms::run()`:

1. Collect parsers from `parsers.xml` and from `/app/parsers`.
2. `runBuiltInDirectives()`:
   - **step 1** on `APP`: `remotetemplate`, `use`, `name`, `init`, `createClient` (copies `/app/client` onto the empty client template), then non-invokable `import` filters.
   - event `ready`
   - `Utils::clientrun()` walks `CLIENT` depth-first and executes element and PI directives. A directive that returns a fragment is inserted and walked; the directive node is then removed.
   - event `documentdone`
   - **step 2** on `APP`: non-invokable `domiterator`, then `xpath` filters.
   - **step 3** on `LANG`: `sys`, `ui`, `err` messages when `$_SESSION["lang"]` is set.
   - event `done`
3. `runParsers()` runs every parser whose `check` passes, against `CLIENT`.

Other engine events: `loaded` (after resources exist; creates `cache/` and `log/`). Each step also fires an event named after its alias.

`Xms::get()` serializes `CLIENT`, through `@outputxsl` when set.

## Directives, filters, parsers

These three are easy to mix up. They run at different times and live in different places.

| Kind | Where it is defined | When it runs | What it is for |
| --- | --- | --- | --- |
| Client directive | Inside `/app/client` (and imported fragments) | During `clientrun`, after `init` / `createClient` | `case`, `import`, `<?php?>`, `<?js?>` |
| Application directive | Children of `/app` | Step 1, before the client walk | `remotetemplate`, `use`, `name`, `init` |
| Filter | `/app/filters` | Step 2, after the client walk, unless `class` contains `invokable` | `xpath`, `domiterator`, `import` |
| Parser | `parsers.xml`, or `/app/parsers` | After all directives, on `CLIENT`, every request | Global transforms (the shipped ones are SEO) |

Builtin directive table (`Xms::$builtinDirectives`):

- element `import` → `Utils::directiveIMPORT` (local xpath or `source` URL; `importashtml`, `cache`, optional `runfirst`)
- element `case` → `Utils::directiveCASE` (a `filter` PI returns the child name to keep; fallback `default`)
- PI target `php` → `Utils::directivePHP`
- PI target `js` → `Utils::directiveJS`

New directives are another entry in `$builtinDirectives`, or added at runtime. Supported node types are elements and processing instructions. `Directive::isDirective()` matches the node against that table.

Filters are the 5.x way to change nodes that `remotetemplate` or `use` brought in from somewhere else:

- `xpath` — run code for each node the xpath selects (`test/docs.ex.xpath.1.xml`)
- `domiterator` — repeat markup from an array of associative arrays (`test/docs.ex.domiterator.*.xml`)
- `import` — same as the directive, declared under filters (`test/docs.ex.import.3.xml`)

A filter with `class` containing `invokable` and an `id` is skipped in the automatic pass. Call `Xms::invokeFilters($id)` to run it.

A parser item has `alias`, `check` (returns whether to run), `xpath`, and `callback`. Shipped parsers in `parsers.xml` fill `<title>`, meta description, language, and keywords when `AWS_SEO_PARSERS_ENABLED` is on. The author notes app-level parsers are rarely needed because an xpath filter does the same job.

## Routing, access, language

`router.xml` holds several models as sibling elements. The active model is the one the `Router` runs (examples in `test/docs.ex.mod_rewrite.1.xml`).

- Model 1: `$_GET["use"]` is the app path, else `AWS_HOME` (`templates/index.xml`). Missing file → `templates/404.xml`. This is the backward-compatible default.
- Model 2: model 1 plus a `<route bind="...">` hook.
- Model 3: path info maps to `templates/{first-segment}.xml`.
- Model 4: a mod_rewrite router.

`urlhandler.php` is the rewrite front door. It streams a file that exists on disk behind the pretty path; otherwise it loads `index.php`.

`access.xml` is allow/deny. `order` is a space-separated chain (`allow deny`). For each verb it looks up the app path and the current user, then `all`, then `unknown`. Default is allow if `order` starts with `allow`. The user is `$_SESSION['XMS_CURRENT_USER']` or `guest` (`XMS_USER_ACCESS_VAR`). `AWS_USER_ACCESS_DISABLED` skips the check. Denial serves `templates/403.xml`.

`lang.xml` is a work in progress. Shape is `/lang/{LANG}/{appName}/{sys|ui|err}/*`. Step 3 copies those into the client. The author expected this matching approach to change.

## Class map

Namespace `Xms\Core`, loaded by `includes/Psr4Autoloader.php` from `includes/autoload.php`.

```
Xms                          the engine; uses Overload, EventHandlerPredefinedMethods, XmsHelpers
  child documents, each with parentNode = the engine:
    APP      XmsXml          the loaded application
    CLIENT   XmsXml          starts as <client><header/><content/></client>
    CONFIG   XmsXml          config.xml
    ROUTER   Router          router.xml
    LANG     XmsXml          lang.xml
    FILTERS  XmsXml          parsers.xml  (property name is historical)

XmsEventHandler              topmost(), on/trigger plumbing expected of nodes and the engine
EventHandlerPredefinedMethods
XmsEvent / XmsDomEvent

Overload                     observable properties and methods (__get/__set/__call, bind)
XmsOverload                  base that carries Overload for DOM wrappers
SmartObject

CommonXml                    xpath helper: q(), each(), filter(), get(), content()
  Xml
    XmsXml
      Router
      XmsAccessControl
  Html
    XmsHtml

DOMElement            -> XmsDomElement
DOMDocument           -> XmsDomDocument
DOMDocumentFragment   -> XmsDomDocumentFragment

Directive                    resolves a node to a builtin handler and invokes it
Utils                        clientrun, directive handlers, logging, import/cache helpers
```

`XmsDomElement` exists so this works, where a raw `DOMElement` would notice:

```php
$myDOMElement->myVar = "some val";
$myDOMElement->bind("change", "myVar", function ($newVal, $oldVal) { ... });
$myDOMElement->myMethod = function ($someParameter) { ... };
$myDOMElement->bind("before", "myMethod", function ($someParameter) { ... });
$myDOMElement->bind("after", "myMethod", function ($someParameter) { ... });
$myDOMElement->on("someEvent", function ($evt) { ... });
$myDOMElement->trigger("anEvent");
```

`bind("change", $property, ...)` watches a property. `bind("before"|"after", $method, ...)` wraps a method. `on` / `trigger` are DOM events and bubble unless cancelled.

`CommonXml::q($xpath)` is the query surface. Callbacks in `each()` are bound onto the matched node when they are closures. Returned fragments from directives are re-entered by `clientrun`, so imported markup is processed the same way as markup written in the app.

## Designer and the files around it

Designer (`templates/designer.xml`, theme `AWS_DESIGNER_THEME`) is the intended editor: applications are written in the browser, not in an external IDE. Login is `AWS_DESIGNER_ADMIN` / `AWS_DESIGNER_PASSWORD` in `defaults.php`. `xmlserver.php` opens and saves files for that session and refuses to dump PHP source as XML.

| Path | Role |
| --- | --- |
| `index.php` | HTTP entry |
| `defaults.php` | Paths, home app, designer credentials, debug, SEO flag |
| `router.xml` | Which app XML to load |
| `access.xml` | Who may load it |
| `config.xml` | App registry (name, alias, description) |
| `parsers.xml` | Global parsers |
| `lang.xml` | Language packs |
| `templates/` | Applications, including Designer, 403, 404, home |
| `xsl/` | Output and HTML/XML conversion sheets |
| `includes/Xms/Core/` | Engine |
| `urlhandler.php` | mod_rewrite resource streaming |
| `xmlserver.php` | Designer file API |
| `cache/` | Import cache |
| `log/` | Debug console and error logs when `AWS_DEBUG` is on |
| `test/docs.ex.*.xml` | The author's examples for each directive and filter |

Debug logging is the observable property `Xms::XMS_SERVER_CONSOLE`. A `change` binding appends to `log/.XMS_SERVER_CONSOLE` when `AWS_DEBUG` is true. Writes must tolerate `topmost()` being null; that is the PHP 8 fatal called out in `CHANGES`.
