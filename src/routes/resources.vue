<script setup lang="ts">
import LinkButton from "../components/atoms/LinkButton.vue";
import PaddingWrapper from "../components/molecules/PaddingWrapper.vue";
</script>

<template>
	<section class="section">
		<h1 class="title has-text-black">Resources</h1>
		<PaddingWrapper>
			<h2 class="title is-4">Discord</h2>
			<LinkButton href="https://discord.viossa.net/">Join</LinkButton>
		</PaddingWrapper>
		<PaddingWrapper>
			<h2 class="title is-4">Vikoli</h2>
			<LinkButton href="https://vikoli.org/">Visit</LinkButton>
		</PaddingWrapper>
		<PaddingWrapper>
			<h2 class="title is-4">Duostories</h2>
			<LinkButton href="https://duostories.org/vios-vios">
				Visit
			</LinkButton>
		</PaddingWrapper>
		<PaddingWrapper>
			<h2 class="title is-4">Risskoli</h2>
			<LinkButton href="https://risskoli.tumblr.com/">Visit</LinkButton>
		</PaddingWrapper>
		<PaddingWrapper>
			<h2 class="title is-4">Davi Hanu</h2>
			<div class="is-flex is-gap-1">
				<LinkButton
					href="https://www.youtube.com/@davihanu1489/featured"
				>
					YouTube
				</LinkButton>
				<LinkButton
					href="https://open.spotify.com/show/5SDEH7IRvIfkLVpD0Mte3g"
				>
					Spotify
				</LinkButton>
				<LinkButton
					href="https://podcasts.apple.com/us/podcast/davi-hanu/id1536362137"
				>
					Apple Podcasts
				</LinkButton>
				<LinkButton
					href="https://www.amazon.com/Davi-hanu/dp/B08K59JH3T"
				>
					Amazon
				</LinkButton>
				<LinkButton href="https://redcircle.com/shows/davi-hanu">
					RedCircle
				</LinkButton>
				<LinkButton
					href="https://tunein.com/podcasts/Sports--Recreation-Podcasts/Davi-hanu-p2116889/?topicId=413528567"
				>
					TuneIn
				</LinkButton>
			</div>
		</PaddingWrapper>
		<PaddingWrapper>
			<h2 class="title is-4">Other</h2>
			<ul>
				<li>WhatsApp</li>
				<li>Telegram</li>
				<li>github.io</li>
				<li>Viossa on Wikipedia</li>
			</ul>
		</PaddingWrapper>
	</section>
</template>
