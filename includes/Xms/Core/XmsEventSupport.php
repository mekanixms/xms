<?php namespace Xms\Core;

/*
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */

interface XmsEventSupport
{

    const BUBBLE_CANCEL = 0;
    const BUBBLE_DEFAULT = 1;
    const BUBBLE_PARENT = 1;
    const BUBBLE_CHILDS = 2;

    function propagate();
}
