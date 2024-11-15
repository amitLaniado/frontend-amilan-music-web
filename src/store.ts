import { ref } from "vue";
import SongBuffer from "./SongBuffer";

const songBuffer = ref<SongBuffer>(new SongBuffer());

export default songBuffer;