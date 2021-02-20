<template>
  <div class="app-container">
    <div id="nav">
      <router-link to="/hello">Hello</router-link> &#9658;
      <router-link to="/list">List</router-link> &#9658;
      <router-link to="/check-in">Check in</router-link> &#9658;
      <router-link to="/info">Info</router-link> &verbar;
      <router-link to="/api-test">API test</router-link>
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>
