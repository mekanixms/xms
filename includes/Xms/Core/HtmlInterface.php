<?php namespace Xms\Core;

/*
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@gmail.com
 * Licensed under GPL license.
 * https://github.com/mekanixms/xms
 *
 * Date: 2010-10-24
 */

interface HtmlInterface
{

    public function content();

    public function body();

    public function head();

    public function getScripts();

    public function getLinks();

    public function getStyles();

    public function bodyContent();

    public function headContent();

    public function documentContent();

    public function addStyle($url, $media = 'all', $user = FALSE);

    public function addScript($url, $run = FALSE);

    public function addMeta($name, $content);

    public function setDescription($dec);

    public function setKeywords($keywords);
}
