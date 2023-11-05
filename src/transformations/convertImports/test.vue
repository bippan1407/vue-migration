<template>
    <div>test</div>
</template>
<script>
import Icon from '~/assets/svgs/Icon.vue';
import { mapGetters } from "vuex";
const Modal = () => import("~/components/Modal.vue");
export default {
    computed: {
        ...mapGetters('documents', ['requiredDocuments']),
        ...mapGetters('documents', ['requiredDocuments', 'oldDocument']),
        ...mapGetters({
            user: "user/isPremium",
            document: "document/newDocument",
            app: "apps/app"
        }),
        ...mapGetters('guest', {
            isGuest: "isInterested",
            newApplication: 'newApplication'
        }),
    },
    methods: {
        click() {
            this.$store.getters['guest/username']
            this.$store.state.docs.allDocs;
        }
    }
}
</script>