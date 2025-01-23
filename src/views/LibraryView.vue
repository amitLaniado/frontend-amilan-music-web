<script setup lang="ts">
import Dialog from 'primevue/dialog';

import { ref, onMounted } from 'vue';

import type { PlaylistDetails } from '@/interfaces';
import { fetcPlaylistsDetails } from '@/api';

import PlaylistView from '@/components/PlaylistView.vue';
import List from '@/components/List.vue';

const userId = 0;
const playlistsDetails = ref<PlaylistDetails[]>([]);
const selectedPlaylistDetails = ref<PlaylistDetails | null>(null);
const isSelectedPlaylist = ref<boolean>(false);

onMounted(async () => {
  playlistsDetails.value = (await fetcPlaylistsDetails(userId)) ?? [];
});

const selectPlaylist = (index: number) => {
  selectedPlaylistDetails.value = playlistsDetails.value[index];
  isSelectedPlaylist.value = true;
}

</script>

<template>
  <main>
    <p class="page-title">Library</p>

    <List
      :data="playlistsDetails"
      class="playlists-list"
      titleAttrName="name"
      subtitleAttrName="songs_amount"
      subtitlePrefix="songs amount: "
      picUrlAttrName="pic_url"
      cardClass="playlist-card"
      playlistClass="playlists-list"
      @selectItem="selectPlaylist"
    />

    <Dialog
      v-model:visible="isSelectedPlaylist"
      :header="selectedPlaylistDetails?.name"
      class="playlist-view-dialog"
    >
    <!-- position="left" -->
      <PlaylistView
        :playlistDetails="selectedPlaylistDetails" 
      />
    </Dialog>
  </main>
</template>

<style>
.playlist-view-dialog	{
  background: linear-gradient(180deg, #1c472b, #121212) !important;
  width: 80% !important;
  height: 70% !important;
}

.playlist-view-dialog .p-dialog-title {
  color: #fff !important;
  font-size: 2.5rem !important;
  margin-top: 0.5rem;
}
</style>
