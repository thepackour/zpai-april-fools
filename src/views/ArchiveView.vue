<template>
  <div class="event-page">
    <!-- iframe으로 외부 HTML 불러오기 -->
    <iframe 
      src="/archive.html" 
      style="width:100%; height:100vh; border:none;"
    />
  </div>
</template>

<script>
export default {
  name: "ArchiveView",
}
</script>

<style scoped>
.event-page {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0;
}

iframe {
	overflow: auto;
}

iframe::-webkit-scrollbar {
  width: 8px;
}

iframe::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.05);           /* 스크롤바 색상 */
  border-radius: 4px;
  transition: background-color 1s;
}

iframe::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);           /* 스크롤바 색상 */
  border-radius: 4px;
}
	
iframe::-webkit-scrollbar-track {
  background: transparent;
}
</style>