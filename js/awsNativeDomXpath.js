/**
 * @preserve
 * XMS - Online Web Development
 * 
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@gmail.com
 * Licensed under GPL license.
 * https://github.com/mekanixms/xms
 *
 * Date: 2010-10-24
 */

function awsNativeDOMSerializer(a) {
    try {
        return (new XMLSerializer()).serializeToString(a)
    } catch (b) {
        try {
            return a.xml
        } catch (b) {
            alert("Xmlserializer not supported")
        }
    }
    return false
}