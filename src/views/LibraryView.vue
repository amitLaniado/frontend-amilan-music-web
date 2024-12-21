<script setup lang="ts">
import List from '@/components/List.vue';

import { ref, onMounted } from 'vue';

import type { PlaylistDetails } from '@/interfaces';
import { fetcPlaylistsDetails } from '@/api';
import PlaylistView from '@/components/PlaylistView.vue';

const userId = 0;
const playlistsDetails = ref<PlaylistDetails[]>([]);
const selectedPlaylistDetails = ref<PlaylistDetails | null>(null);

onMounted(async () => {
  playlistsDetails.value = (await fetcPlaylistsDetails(userId)) ?? [];
});

</script>

<template>
  <main>
    <PlaylistView
      v-if="selectedPlaylistDetails"
      :playlistDetails="selectedPlaylistDetails" 
    />

    <div
      v-else
    >
      <p>Library</p>

      <List
        :data="playlistsDetails"
        class="playlists-list"
        titleAttrName="name"
        subtitleAttrName="songs_amount"
        subtitlePrefix="songs amount: "
        @selectItem="(index) => selectedPlaylistDetails = playlistsDetails[index]"
      />
    </div>
  </main>
</template>

<style scoped>
/* Styling the main container */
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-y: hidden;
}

p {
  text-align: center;
}

.playlists-list {
  /* display: flex; */
  width: 400px;
}
</style>
