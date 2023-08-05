<script lang="ts">
  import { onMount } from 'svelte';
	import Buttons from './Buttons.svelte';

	interface IFolder {
   fullPath: string,
	 isDirectory: boolean,
	 isFile: boolean,
	 name: string,
	 fileSystem: Record<any, any>
	}

	interface IFile {
		name: string,
		path: string,
		type: string,
		lastModified: number,
		lastModifiedDate: Date,
		size: number,
		webkitRelativePath: string
	}
  
  let isDragging = false;
	let folderPath: string;
	let error: string;
  
  const handleDragEnter = (event: DragEvent): void => {
    event.preventDefault();
    isDragging = true;
  }
  
  const handleDragLeave = (event: DragEvent): void => {
    event.preventDefault();
    isDragging = false;
  }
  
  const handleDragOver = (event: DragEvent): void => {
    event.preventDefault();
    isDragging = true;
  }
  
  const handleDrop = (event: DragEvent): void => {
    event.preventDefault();
    isDragging = false;
    const files = event.dataTransfer.items;
    const folder = files[0].webkitGetAsEntry();
		console.log('folder: ', folder);
    uploadFolder(folder);
  }
	const isDirectoryEmpty = (files: IFile[]): boolean => (
    files.filter(file => file[0] !== '.').length < 1
	);

	const handleFolderDrop = (folder: IFolder, files: IFile[]): void => {
		if (isDirectoryEmpty(files)) {
      error = 'This folder is empty';
			return;
		}

		const absoluteFilePath = files[0].path.split('/').slice(0, -1).join('/');
		folderPath = absoluteFilePath;
	};

	const isUploadAFolder = (folder: IFolder): boolean => (
    folder.isDirectory
	);

  const readFolder = async (folder: any, files: any[]) => {
    const reader = folder.createReader();
    const entries: Record<any, any>[] = await new Promise((resolve) => reader.readEntries(resolve));
    for (const entry of entries) {
      if (entry.isFile) {
        const file = await new Promise((resolve) => entry.file(resolve));
        files.push(file);
      } else if (entry.isDirectory) {
        await readFolder(entry, files);
      }
    }
  }

  const uploadFolder = async (folder: any): Promise<void> => {
		error = null;
		folderPath = null;
		if (!isUploadAFolder(folder)) {
			error = 'This is a file, please upload a folder';
			return
		}
	  console.log('folder: ', folder);
    const files: any[] = [];
    await readFolder(folder, files);
    console.log('files from upload: ', files); // Do something with the files
		handleFolderDrop(folder, files);
  }
  
  onMount(() => {
    const container = document.getElementById('drop-container');
    container.addEventListener('dragenter', handleDragEnter);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
    return () => {
      container.removeEventListener('dragenter', handleDragEnter);
      container.removeEventListener('dragleave', handleDragLeave);
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('drop', handleDrop);
    };
  });
</script>

<div id="drop-container" class="{isDragging ? 'dragging' : ''}{error ? 'error' : ''}{folderPath ? 'success' : ''}">
  <p>{folderPath ?? 'Drag and drop a folder here to shuffle contents'}</p>
</div>
<div class="error-text">
	<p>{error ?? ''}</p>
</div>

<Buttons
  folderPath={folderPath}
/>

<style lang="scss">
  #drop-container {
    width: 85%;
    height: 70%;
    border: 1px solid #cccccc69;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: auto;
    margin-left: auto;
    backdrop-filter: blur(6px) brightness(90%);
    border-radius: 10px;

		.dragging {
      border: 1px solid white;
    }

		.error {
		  border: 1px solid #dc6c27;
	  }  

		.success {
		  border: 1px solid #5adc27;
	  }
  }

	.error-text {
    margin-left: auto;
    margin-right: auto;
    p {
      color: #dc6c27;
    }
	}
</style>
