<script lang="ts">
  const {ipcRenderer} = require('electron');

  export let folderPath: string;
  let hasBeenShuffled: boolean = false;
  let isShuffling: boolean = false;
  let isUndoing: boolean = false;
  $: shuffleDisabled = !folderPath || hasBeenShuffled;
  $: undoDisabled = !folderPath || !hasBeenShuffled;
  $: handleCheckFile(folderPath);

  const handleCheckFile = async (...args): Promise<void> => {
    try {
      if (folderPath) {
        const result =  await ipcRenderer.invoke('checkFolder', folderPath);
        hasBeenShuffled = result;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShuffle = async (...args): Promise<void> => {
    try {
      isShuffling = true;
      await ipcRenderer.invoke('shuffle', folderPath);
      isShuffling = false;
      hasBeenShuffled = true;
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async (...args): Promise<void> => {
    try {
      isUndoing = true;
      await ipcRenderer.invoke('undo', folderPath);
      isUndoing = false;
      hasBeenShuffled = false;
    } catch (err) {
      console.error(err);
    }
  };

</script>

<div>
  <button disabled={shuffleDisabled} on:click={handleShuffle}>{isShuffling ? 'Loading...' : 'SHUFFLE'}</button>
  <button disabled ={undoDisabled} on:click={handleUndo}>{isUndoing ? 'Loading...' : 'UNDO'}</button>
  <span>{hasBeenShuffled}</span>
</div>

