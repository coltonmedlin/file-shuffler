<script lang="ts">
  import StatusBar from "./StatusBar.svelte";
  const {ipcRenderer} = require('electron');

  export let folderPath: string;
  let hasBeenShuffled: boolean = false;
  let isShuffling: boolean = false;
  let isUndoing: boolean = false;
  let showStatusBar: boolean = false;
  let error: string = null
  $: shuffleDisabled = !folderPath || hasBeenShuffled;
  $: undoDisabled = !folderPath || !hasBeenShuffled;
  $: handleCheckFile(folderPath);
  $: handleShowStatusBar(showStatusBar, error = null);

  const handleCheckFile = async (...args): Promise<void> => {
    try {
      if (folderPath) {
        const result =  await ipcRenderer.invoke('checkFolder', folderPath);
        hasBeenShuffled = result;
      }
    } catch (err) {
      console.error(err);
      error = 'Error: problem reading folder, please try again.';
    }
  };

  const handleShuffle = async (...args): Promise<void> => {
    try {
      isShuffling = true;
      await ipcRenderer.invoke('shuffle', folderPath);
      isShuffling = false;
      hasBeenShuffled = true;
      showStatusBar = true;
    } catch (err) {
      console.error(err);
      error = 'Error: unable to shuffle files, please try again.';
    }
  };

  const handleUndo = async (...args): Promise<void> => {
    try {
      isUndoing = true;
      await ipcRenderer.invoke('undo', folderPath);
      isUndoing = false;
      hasBeenShuffled = false;
      showStatusBar = true;
    } catch (err) {
      console.error(err);
      error = 'Error: unable to undo, please try again.'
    }
  };

  const handleShowStatusBar = (...args) => {
    const delayClose = () => setTimeout(() => {
      showStatusBar = false;
      error = null
    }, 2000);
    delayClose();
  };

</script>

<div class="container">
  {#if showStatusBar}
  <StatusBar error={error}/>
  {/if}
  <button disabled={shuffleDisabled} on:click={handleShuffle}>{isShuffling ? 'Loading...' : 'SHUFFLE'}</button>
  <button disabled ={undoDisabled} on:click={handleUndo}>{isUndoing ? 'Loading...' : 'UNDO'}</button>
</div>

<style lang="scss">

.container {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

</style>