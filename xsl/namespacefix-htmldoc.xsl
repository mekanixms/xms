<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="*">
      <xsl:apply-templates select="./@*|./node()|./comment()|./processing-instruction()|./text()"/>
  </xsl:template>

  <xsl:template match="@*" name="attributes">
    <xsl:attribute name="{local-name()}">
      <xsl:value-of select="."/>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="/|node()">
	<xsl:copy name="{local-name()}">
		<xsl:call-template name="attributes"></xsl:call-template>
		<xsl:copy-of select="./node()|./comment()|./processing-instruction()|./text()"></xsl:copy-of>
	</xsl:copy>
  </xsl:template>
  
  <xsl:template match="comment()|processing-instruction()|text()">
    <xsl:copy-of select="."></xsl:copy-of>
  </xsl:template>
  
  <xsl:output method="html" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" 
     doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" indent="yes"/>

</xsl:stylesheet>
