<div class="account">
	<!-- IMPORT partials/account/header.tpl -->

	<p>[[persona:settings.intro]]</p>

	<hr />

	<form id="theme-settings" role="form">
		<div class="checkbox">
			<label>
				<input type="checkbox" id="persona:menus:legacy-layout" name="persona:menus:legacy-layout"> <strong>[[persona:settings.mobile-menu-side]]</strong>
			</label>
		</div><br />

		<div class="form-group">
			<label for="persona:navbar:autohide">[[persona:settings.autoHidingNavbar]]</label>
			<select multiple class="form-control" name="persona:navbar:autohide" id="persona:navbar:autohide">
				<option value="xs">[[persona:settings.autoHidingNavbar-xs]]</option>
				<option value="sm">[[persona:settings.autoHidingNavbar-sm]]</option>
				<option value="md">[[persona:settings.autoHidingNavbar-md]]</option>
				<option value="lg">[[persona:settings.autoHidingNavbar-lg]]</option>
			</select>
		</div>

        <div class="form-group">
            <label for="mffThemeSkin">Style de MFFv4</label>
            <select class="form-control" id="mffThemeSkin" data-property="mffThemeSkin" autocomplete="off">
                <option value="light" <!-- IF !darkTheme -->selected<!-- ENDIF !darkTheme -->>[[persona:settings.theme.light]]</option>
                <option value="dark" <!-- IF darkTheme -->selected<!-- ENDIF darkTheme -->>[[persona:settings.theme.dark]]</option>
            </select>
        </div>

		<button id="save" type="button" class="btn btn-primary">[[global:save_changes]]</button>
	</form>
</div>
