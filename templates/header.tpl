<!DOCTYPE html>
<html lang="{function.localeToHTML, userLang, defaultLang}" {{{if languageDirection}}}data-dir="{languageDirection}" style="direction: {languageDirection};" {{{end}}} >
<head>
	<title>{browserTitle}</title>
	{{{each metaTags}}}{function.buildMetaTag}{{{end}}}
	<link rel="stylesheet" type="text/css" href="{relative_path}/assets/client{{{if bootswatchSkin}}}-{bootswatchSkin}{{{end}}}.css?{config.cache-buster}" />
	{{{each linkTags}}}{function.buildLinkTag}{{{end}}}

	<script>
		var config = JSON.parse('{{configJSON}}');
		var app = {
			user: JSON.parse('{{userJSON}}')
		};
	</script>

 	{{{if useCustomHTML}}}
	{{customHTML}}
	{{{end}}}
	{{{if useCustomCSS}}}
	<style>{{customCSS}}</style>
	{{{end}}}
</head>

<body class="{bodyClass} skin-{{{if bootswatchSkin}}}{bootswatchSkin}{{{else}}}noskin{{{end}}}">
	<nav id="menu" class="slideout-menu hidden">
		<!-- IMPORT partials/slideout-menu.tpl -->
	</nav>
	<nav id="chats-menu" class="slideout-menu hidden">
		<!-- IMPORT partials/chats-menu.tpl -->
	</nav>

	<main id="panel" class="slideout-panel">
		<nav class="navbar navbar-default navbar-fixed-top header" id="header-menu" component="navbar">
			<!-- MFF change: container-fuild and add shard and logo -->
			<div class="container-fluid">
				<div class="shard">
					<a href="{{{if brand:logo:url}}}{brand:logo:url}{{{else}}}{relative_path}/{{{end}}}"><img src="/plugins/nodebb-theme-mff/images/logo.png"></a>
				</div>
				<!-- IMPORT partials/menu.tpl -->
			</div>
			<!-- MFF change: container-fuild and add shard and logo END -->
		</nav>
		<!-- MFF change: banner -->
		<div id="banner"></div>
		<!-- MFF change: banner END -->
		<div class="container" id="content">
        <!-- IMPORT partials/noscript/warning.tpl -->
