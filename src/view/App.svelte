<script lang="ts">
  import FolderPath from './components/FolderPath.svelte';
</script>

<main>
  <div class="title">
    <h1>FILE SHUFFLER</h1>
    <h4>quickly scramble the files in a folder</h4>
  </div>
  <FolderPath/>
</main>

<style>
  :global(body) {
    background-color: #15456D;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23023c63' fill-opacity='0.6'%3E%3Crect x='100' width='100' height='100'/%3E%3Crect y='100' width='100' height='100'/%3E%3C/g%3E%3Cg fill-opacity='0.5'%3E%3Cpolygon fill='url(%23a)' points='100 30 0 0 200 0'/%3E%3Cpolygon fill='url(%23b)' points='100 100 0 130 0 100 200 100 200 130'/%3E%3C/g%3E%3C/svg%3E");
    height: 100%;
    padding: 10px;
  }

  :global(html, main) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  :global(h1, h4, p) {
    color: #e9e7dff0;
    font-family: Arial, Helvetica, sans-serif;
  }

  :global(button) {
    padding: 10px 15px 10px 15px;
    font-size: 14px;
    margin-right: 10px;
    background-color: none;
    color: #e9e7dff0;
    border: 1px solid #cccccc69;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0);
  }

  :global(button:disabled) {
    background-color: rgba(0, 0, 0, 0.5);
    color: #e9e7df82;
  }

  .title {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
</style>