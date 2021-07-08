<template>
<div>
  <hr>
  Child counter : {{ $store.state.counter }} <br>
  <button>+</button>
  <button>-</button>
</div>
</template>

<script>
export default {
  // 상위 컴포넌트에서 내려준 counter 속성을 num로 받음
  props: ["num"]
};
</script>