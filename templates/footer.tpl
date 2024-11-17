		</div><!-- /.container#content -->
	</main>
	{{{ if !isSpider }}}
	<div component="toaster/tray" class="alert-window">
		<!-- IMPORT partials/reconnect-alert.tpl -->
	</div>
	{{{ end }}}

    <!-- MFF change: Footer -->
    <footer>
        <div class="container-fluid">
            <div class="row footer-row">
                <div class="col-xs-12 col-sm-8 col-md-7 col-lg-6">
                <div class="shard footer-shard">
                    <a href="/"><img src="/assets/plugins/@minecraftforgefrance/nodebb-theme-mff/images/credits.webp" alt="Design by Woryk"></a>
                </div>
                <div class="footer-link">
                    <a href="/contact">Contact</a><a href="/legalnotice">Mentions Légales</a>
                </div>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-5 col-lg-6">
                <div class="pull-right footer-social-networks no-pull-xs">
                    <!--Facebook-->
                    <a href="https://www.facebook.com/MinecraftForgeFrance" target="_blank" class="icons-sm"><i class="fa fa-facebook"> </i></a>
                    <!--Twitter-->
                    <a href="https://twitter.com/MCForgeFrance" target="_blank" class="icons-sm"><i class="fa fa-twitter"> </i></a>
                    <!--Youtube-->
                    <a href="https://www.youtube.com/user/MinecraftForgeFrance" target="_blank" class="icons-sm"><i class="fa fa-youtube"> </i></a>
                    <!--Discord-->
                    <a href="https://discordapp.com/invite/0uXCYNHVWGM8sAYS" target="_blank" class="icons-sm"><i class="fab fa-discord"></i></a>
                </div>
                </div>
            </div>
            <div class="row footer-copyright footer-row">
                <div class="col-xs-12">
                <p class="pull-left footer-link no-pull-xs">MINECRAFT FORGE FRANCE © 2024</p>
                <p class="pull-right no-pull-xs">Powered by <a href="https://nodebb.org/" target="_blank">NodeBB</a></p>
                </div>
            </div>
        </div>
    </footer>
    <!-- MFF change: Footer END -->

    <!-- IMPORT modules/taskbar.tpl -->
	<!-- IMPORT partials/footer/js.tpl -->
</body>
</html>
