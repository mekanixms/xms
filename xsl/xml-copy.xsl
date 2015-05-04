<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:template match="*|/|comment()|processing-instruction()|@*">
    
  <xsl:copy-of select="."/></xsl:template>

  

  
  
<xsl:output method="xml" indent="yes" omit-xml-declaration="no"/>

</xsl:stylesheet>
