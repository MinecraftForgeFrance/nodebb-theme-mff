<!-- MFF add: section display. This partial don't exist in Persona -->
<li component="categories/category" data-cid="{../cid}" data-numRecentReplies="1" class="row clearfix">
	<meta itemprop="name" content="{../name}">

	<div class="content col-xs-12 col-md-12 col-sm-12">
		<div class="section-header">
            <div class="section-title-wrapper">
				<h2 class="title">
					{../name}
				</h2>
			  	<a data-bs-toggle="collapse" data-bs-target="#collapse-section-{../cid}" role="button" aria-expanded="true" aria-controls="collapse-section-{../cid}">
                	<i class="fa fa-minus section-toggle"></i>
				</a>
            </div>
			<!-- IF ../descriptionParsed -->
			<span class="section-desc">{../descriptionParsed}</span>
			<!-- ENDIF ../descriptionParsed -->
		</div>
		<div class="section-contents collapse show" id="collapse-section-{../cid}">
			<ul class="categories" itemscope itemtype="http://www.schema.org/ItemList">
			{{{each categories.children}}}
                <!-- IMPORT partials/categories/item.tpl -->
			{{{end}}}
            </ul>
		</div>
	</div>
</li>
