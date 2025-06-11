<template>
  <header
    class="navbar is-fixed-top" role="navigation" aria-label="main navigation">

      <div class="navbar-brand">
        <RouterLink class="navbar-item has-text-weight-bold p-0" to="/" >
          <img src="@/assets/ViossaFlagRect.svg" id="viossa-flag" alt="Viossa flag" />
        </RouterLink> 

        <div class="navbar-item">
          <button 
            type="button"
            @click="toggleBurger()"
            :class="`button is-link is-hoverable is-hidden-desktop ${burgerOpen ? 'is-active' : ''}`" aria-label="menu"
            :aria-expanded="`${burgerOpen ? 'true' : 'false'}`">
            <span class="bx bx-burger"></span>
          </button>
        </div>
      </div>
      
      <div :class="`navbar-menu ${burgerOpen ? 'is-active' : ''}`">
        <div class="navbar-start">
          <RouterLink class="navbar-item" to="/">What is Viossa?</RouterLink>
          <RouterLink class="navbar-item" to="/resources">Resources</RouterLink>
        </div>
      </div>

    </header style="backdrop-filter: blur(8px); background-color: oklab(80% var(--bulma-navbar-background-color) transparent);">
</template>