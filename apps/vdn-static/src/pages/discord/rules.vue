<script setup lang="ts">
import SmartLink from "@/components/organisms/SmartLink.vue";
import { useLocale } from "@/i18n";

const locale = useLocale();
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">{{ locale.discord.rulesPage.title }}</h1>
		</section>
		<section class="section content">
			<h2>{{ locale.discord.rulesPage.overview.title }}</h2>
			<blockquote>
				{{ locale.discord.rulesPage.overview.help }}
			</blockquote>
			<ol>
				<SmartLink
					covert
					:to="{ type: 'internal', internal: { id: 'rule-1' } }">
					<li>
						No translation! Do not translate to/from Viossa on the
						server, except the big four translatables (you can learn
						in hard mode without them!)
					</li>
				</SmartLink>
				<SmartLink
					covert
					:to="{ type: 'internal', internal: { id: 'rule-2' } }">
					<li>If it's understood, it's Viossa.</li>
				</SmartLink>
				<SmartLink
					covert
					:to="{ type: 'internal', internal: { id: 'rule-3' } }">
					<li>
						The chats in the Viossa Only category are Viossa only.
					</li>
				</SmartLink>
				<SmartLink
					covert
					:to="{ type: 'internal', internal: { id: 'rule-4' } }">
					<li>
						This server is SFW. No sexually explicit, gory, or
						violent content.
					</li>
				</SmartLink>
				<SmartLink
					covert
					:to="{ type: 'internal', internal: { id: 'rule-5' } }">
					<li>Don't use hate speech, and respect each other.</li>
				</SmartLink>
				<SmartLink
					covert
					:to="{ type: 'internal', internal: { id: 'rule-6' } }">
					<li>
						Respect the rulings of the staff (<b>@Yewald</b> and
						<b>@Yewaldnen</b>).
					</li>
				</SmartLink>
				<SmartLink
					covert
					:to="{ type: 'internal', internal: { id: 'rule-7' } }">
					<li>
						Discussion of controversial topics (politics, war, etc.)
						should be directed to #polite, which requires the @Ike
						role to view, which is itself locked behind
						<b>@Viossadjin</b> and <b>@mellandjin</b>.
						<ul class="mt-0">
							<li>
								<b>#feels-and-advice</b> is for talking about
								your feelings openly, but we draw the line at
								suicidal or violent ideation. These are trains
								of thought to be brought to a therapist, and are
								not jokes. Because of their seriousness, they
								simply don't belong here.
							</li>
						</ul>
					</li>
				</SmartLink>
			</ol>
		</section>
		<section class="section content" id="rule-1">
			<h2>Rule 1: No translation</h2>
			<p>
				Translation is not how we learn and teach Viossa. Instead, we
				teach using pictures, diagrams, video calls, and other aids to
				couple words to meaning.
			</p>
			<p>
				On the Viossa Diskordserver, you are allowed to translate the
				following four words. If you want an extra challenge, don't
				unspoiler the text:
			</p>
			<blockquote>TODO - big 4</blockquote>
			<p>
				Outside of the teaching-learning cycle, we also make an
				exception for artistic translations (such as those of songs,
				books, or poems), as well as for academic translations (such as
				for a formal research paper). In both cases, this exception is
				dependent on translations of either class appearing in the
				appropriate place. If you're not sure where that is, please ask.
			</p>
			<p>
				Additionally, please don't attempt to derive or share
				translation-based learning materials on-server, or poach members
				for such a purpose.
			</p>
		</section>
		<section class="section content" id="rule-2">
			<h2>Rule 2: If it's understood, it's Viossa</h2>
			<p>
				All that is required to speak Viossa is that other speakers be
				able to understand you. There is no right or wrong way to speak
				or write, and no global standard.
			</p>
			<p>
				However, Viossa is a collaborative group project: members should
				strive to make others understand them, and in return make an
				effort to understand others.
			</p>
		</section>
		<section class="section content" id="rule-3">
			<h2>Rule 3: Viossa-only chats</h2>
			<p>
				Chats in the Viossa Only section do not permit English. If you
				must use English to coach learners on the learning process, go
				to <b>#meta</b> instead.
			</p>
			<p>
				This doesn't mean that other channels are English-only, though!
				Viossa is allowed everywhere.
			</p>
		</section>
		<section class="section content" id="rule-4">
			<h2>Rule 4: SFW</h2>
			<p>
				If a mod does not like what you have posted, they will inform
				you; see
				<SmartLink
					:to="{ type: 'internal', internal: { id: 'rule-6' } }"
					>Rule 6</SmartLink
				>. This is a public Discord server; think before you post.
			</p>
		</section>
		<section class="section content" id="rule-5">
			<h2>Rule 5: Respect one another</h2>
			<p>
				Respect one another. Using slurs or hate speech against others,
				whether on- or off-server, or advocating for violence are not
				welcome. This is an LGBTQ+ friendly international community.
			</p>
		</section>
		<section class="section content" id="rule-6">
			<h2>Rule 6: Respect the staff's rulings</h2>
			<p>
				The word of staff (the Yewald as well as the Yewaldnen) is
				final, and they may kick, ban, or mute members or change
				members' access permissions to make sure this environment stays
				respectful and puts the Viossa community first.
			</p>
			<p>
				Appeals will always be considered, and if you feel that a mod
				action was inappropriate, you can DM any Yewald or open a ticket
				with YAGPDB's /tickets open command.
			</p>
			<p>
				If you are banned, there will be instructions on how to appeal
				the ban, however, please take the time to reflect on the ban
				reason before appealing.
			</p>
		</section>
		<section class="section content" id="rule-7">
			<h2>Rule 7: #polite and ike</h2>
			<p>
				Many are life's troubling realities, and vast is our need to
				discuss them. The ike category is an opt-in set of chats where
				discussion of heavy, sensitive, or potentially contentious
				topics is allowed, provided that users are especially respectful
				of each other during such discussions. By accepting the ike
				role, you agree to adhere to this rule and encourage others to
				do the same.
			</p>
			<h3>Venting vs seeking advice</h3>
			<p>
				Sometimes you want to let people know that you're dealing with
				an issue and just be acknowledged, other times you want help in
				solving a problem. If you are open to one but not the other,
				it's often a good idea to let people know as part of the
				discussion so that you can receive the kind of responses you are
				looking for.
			</p>
			<h3>Self-harm and Violence</h3>
			<p>
				While discussing self-harm in general is allowed (with
				appropriate and clear use of content warnings), this server in
				itself is not an emergency mental health resource, and is not a
				substitute for professional help. Asking others for advice in
				finding support or resources off-server is fine, but asking
				others to participate in talking you down is inappropriate.
			</p>
			<p>You should not use this space to:</p>
			<ul>
				<li>express intent or desire to harm yourself or others</li>
				<li>
					solicit help in stopping yourself from harming yourself or
					someone else
				</li>
			</ul>
			<p>
				By crossing these boundaries, please be aware that you are
				asking members of the server (including moderators and the
				owner) to perform a role for which they are not trained or
				equipped. At the moderators' sole discretion, this may not be
				tolerated and may result in a warning, timeout, removal of the
				@ike role, or removal from the server.
			</p>
			<p>
				If you are struggling with thoughts of this nature, but are not
				immediately in danger, please consider seeking counseling. If
				you are experiencing an immediate crisis, please call 988 (in
				the United States), 999 (in the UK), or locate an emergency
				hotline appropriate for you. A list of resources by country
				exists here:
				<SmartLink
					:to="{
						type: 'external',
						external:
							'https://blog.opencounseling.com/suicide-hotlines/',
					}"
					new-tab
					>https://blog.opencounseling.com/suicide-hotlines/</SmartLink
				>
			</p>
		</section>
	</div>
</template>
