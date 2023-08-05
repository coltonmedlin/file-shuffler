<script lang="ts">
  import {fly} from 'svelte/transition';

  export let error: string = null;
</script>

<div class="container" transition:fly>
  <p class={error ? 'error' : ''}>
    {error ?? 'Success'}
  </p>
</div>

<style lang="scss">
  .container {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translate(-50%);
    right: auto;
    padding: 5px 40px 5px 40px;
    background-color: rgba(0, 0, 0, .8);
    border: 1px solid white;
    border-radius: 10px;
    color: white;
    line-height: 0;
    .error {
      color: red;
    }
  }
</style>