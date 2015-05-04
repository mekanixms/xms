<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">




<xsl:template match="/">
  <html>
      <xsl:apply-templates select="*"/>
  </html>
</xsl:template>

<xsl:template match="head">
  <head>
  	<xsl:copy-of select="./@*"></xsl:copy-of>
  	<xsl:choose>
  		<xsl:when test="node()">
  			<xsl:apply-templates/>
  		</xsl:when>
  		<xsl:otherwise>
  			<xsl:copy-of select="." />
  		</xsl:otherwise>
  	</xsl:choose>
  </head>
</xsl:template>

<xsl:template match="body">
  <body>
  	<xsl:copy-of select="./@*"></xsl:copy-of>
  	<xsl:choose>
  		<xsl:when test="node()">
  			<xsl:apply-templates/>
  		</xsl:when>
  		<xsl:otherwise>
  			<xsl:copy-of select="." />
  		</xsl:otherwise>
  	</xsl:choose>
  </body>
</xsl:template>



  <xsl:template match="script" name="scripts">
 	<xsl:element name="script">
		<xsl:copy-of select="./@*"></xsl:copy-of>
		<xsl:value-of select="./text()" disable-output-escaping="yes"/>
 	</xsl:element>
  </xsl:template>
  
  <xsl:template match="style" name="styles">
 	<xsl:element name="style">
		<xsl:copy-of select="./@*"></xsl:copy-of>
		<xsl:value-of select="./text()" disable-output-escaping="yes"/>
 	</xsl:element>
  </xsl:template>
  
  <xsl:template match="link|base|title">
		<xsl:copy-of select="."></xsl:copy-of>
  </xsl:template>
  
  <xsl:template match="a|abbr|acronym|address|applet|area|b|basefont|bdo|big|blockquote|br|button|caption|center|cite|code|col|colgroup|dd|del|dfn|dir|div|dl|dt|em|fieldset|font|form|frame|frameset|hear|h1|h2|h3|h4|h5|h6|hr|i|iframe|input|img|ins|kbd|label|legend|li|link|map|menu|meta|noframes|noscript|object|ol|optgroup|option|p|param|pre|q|s|samp|select|small|span|strike|strong|sub|sup|table|tbody|td|textarea|tfoot|th|thead|tr|tt|u|ul|var">
		<xsl:copy-of select="."></xsl:copy-of>
  </xsl:template>
  
  <xsl:template match="comment()|processing-instruction()|text()">
		<xsl:copy-of select="."></xsl:copy-of>
  </xsl:template>
	
<xsl:output
  method="xml"
  omit-xml-declaration="yes"
  doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
  doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
  indent="yes"/>
	
</xsl:stylesheet>
