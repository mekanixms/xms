<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />


  
 <xsl:template match="html">
 	<xsl:element name="client">
		<xsl:copy-of select="./@*"></xsl:copy-of>
      	<xsl:apply-templates select="./node()|./comment()|./processing-instruction()|./text()"/>
 	</xsl:element>
  </xsl:template>
  


  <xsl:template name="header" match="head">
	  <xsl:element name="header">
	  	<xsl:copy-of select="@*"></xsl:copy-of>
	  	<xsl:for-each select="./node()|./comment()|./processing-instruction()|./text()">
		  <xsl:choose>
		  
			  <xsl:when test="local-name()='meta'">
			  	<xsl:element name="metas">
			  		<xsl:element name="element">
			  			<xsl:copy-of select="./@*">
			  			</xsl:copy-of>
			  		</xsl:element>
			  	</xsl:element>
			  </xsl:when>
			  
			  <xsl:when test="local-name()='script'">
			  
			  	<xsl:choose>
			  		<xsl:when test="./@src">
				  		<xsl:element name="load">
				  			<xsl:copy-of select="./@*"></xsl:copy-of>
				  		</xsl:element>
			  		</xsl:when>
			  		
			  		<xsl:otherwise>
				  		<xsl:element name="run">
						  	<xsl:copy-of select="./@*"></xsl:copy-of>
						  	<xsl:copy-of select="./node()|./comment()|./processing-instruction()|./text()"></xsl:copy-of>
				  		</xsl:element>
			  		</xsl:otherwise>
			  	</xsl:choose>
			  
			  </xsl:when>
			  
			  <xsl:when test="local-name()='style'">
			  		<xsl:element name="style">
				  			<xsl:copy-of select="./@*"></xsl:copy-of>
				  			<xsl:copy-of select="./node()|./comment()|./processing-instruction()|./text()"></xsl:copy-of>
			  		</xsl:element>
			  </xsl:when>
			  
			  <xsl:when test="local-name()='link'">
			  
			  	<xsl:choose>
			  		<xsl:when test="./@type='text/css'">
				  		<xsl:element name="style">
				  			<xsl:copy-of select="./@*"></xsl:copy-of>
				  			<xsl:copy-of select="./node()|./comment()|./processing-instruction()|./text()"></xsl:copy-of>
				  		</xsl:element>
			  		</xsl:when>
			  		
			  		<xsl:otherwise>
				  		<xsl:element name="links">
				  			<xsl:element name="element">
					  			<xsl:copy-of select="./@*"></xsl:copy-of>
							  	<xsl:copy-of select="./node()|./comment()|./processing-instruction()|./text()"></xsl:copy-of>
				  			</xsl:element>
				  		</xsl:element>
			  		</xsl:otherwise>
			  	</xsl:choose>
			  
			  </xsl:when>
		  
			  <xsl:otherwise>
			  	<xsl:copy-of select="."></xsl:copy-of>
			  </xsl:otherwise>
			  
		  </xsl:choose>
	  	</xsl:for-each>
	  </xsl:element>
  </xsl:template>
  
  
    <xsl:template name="content" match="body">
	  <xsl:element name="content">
		<xsl:copy-of select="./@*">
		</xsl:copy-of>
					  			
		<xsl:copy-of select="./node()|./comment()|./processing-instruction()|./text()">
		</xsl:copy-of>
	  </xsl:element>
  </xsl:template>

	<xsl:template match="node()|comment()|processing-instruction()|text()">
		<xsl:copy-of select="."></xsl:copy-of>
	</xsl:template>
 
  
<xsl:output method="xml" indent="yes" omit-xml-declaration="no"/>

</xsl:stylesheet>


