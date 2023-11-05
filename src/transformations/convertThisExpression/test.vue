<template>
    <div>test</div>
</template>
<script>
export default {
    props: {
        value: {
            type: String,
            required: true
        },
        university: {
            type: Object,
        }
    },
    data() {
        return {
            isDropdownOpen: false,
            user: {
                name: 'jerry',
                value: this.$store.state.user.age
            }
        };
    },
    computed: {
        ...mapState('documents', ['documents']),
        ...mapState('documents', {
            activeAccordian: 'activeAccordian'
        }),
        ...mapState({
            menu: 'documents/menu'
        }),
        ...mapGetters('documents', ['filteredDocuments']),
        ...mapGetters({
            isGuestUser: "auth/isGuestUser",
            user: "auth/getUser",
        }),
        activeMenu() {
            return this.documents.find(item => item.active);
        },
        showUser() {
            return this.filteredDocuments?.name === 'Application' && this.isGuestUser;
        },
        isNewUser() {
            return this.$route.query?.doc === 'finance';
        },
    },
    methods: {
        onClick(option) {
            this.$emit('input', option.value);
            this.$emit('on-change', option);
            this.isDropdownOpen = false;
            const newValue = this.documents
            this.$refs.dropdownOptions.style.setProperty('--dd-left', `-${left}px`);
            this.$store.getters['user/newUser']
            this.$store.commit('user/addUser')
            this.$store.state.user.isKSUser
            this.$store.dispatch(
                'accountsettings/editUserDetails',
                payload
            );
            this.$axios.get('test')
                .then((response) => {
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        setDropDownLocation() {
            const rect = this.$refs.customDropdown.getBoundingClientRect();
        }
    },
    mounted() {
        this.$emit('input', option.value);
        this.$emit('on-change', option);
        this.isDropdownOpen = false;
        const newValue = this.documents
    },
    beforeDestroy() {
        this.$emit('input', option.value);
        this.$emit('on-change', option);
        this.isDropdownOpen = false;
        const newValue = this.documents
    },
    destroyed() {
        this.$emit('input', option.value);
        this.$emit('on-change', option);
        this.isDropdownOpen = false;
        const newValue = this.documents
    },
}
</script>