<template>
	<div class="navbar">
		<div class="navbar-menu">
			<div class="navbar-start">
				<div class="navbar-item">
					<RouterLink to="/">Home</RouterLink>
				</div>
				<div class="navbar-item">
					<RouterLink to="/resources">Resources</RouterLink>
				</div>
			</div>
		</div>
	</div>
	<section class="container">
		<RouterView />
	</section>
</template>
