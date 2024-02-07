<template>
    <div>vue-migration</div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/store/user'
import { useDeveloperStore } from '~/store/developer'
import { useDevStore } from '~/store/dev'


// #region emits
const emit = defineEmits(["on-redirect", "update:modelValue"])
// #endregion emits


// #region props
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    modelValue: {
        type: String,
        required: true
    }
})
// #endregion props


// #region nuxt properties
const router = useRouter();

// #endregion nuxt properties

// #region pinia state, getters and actions
const developerStore = useDeveloperStore()
const userStore = useUserStore()
const devStore = useDevStore()
const { isDeveloper, isManager, devName } = storeToRefs(userStore)
const { addDeveloper } = developerStore
const { addNewUser: createNewUser, createUser } = userStore
const { onDescriptionChangeByDev } = devStore

// #endregion pinia state, getters and actions

// #region component data
const description = ref("upgrade from vue 2 to vue 3");

// #endregion component data


// #region computed properties
const nameAndDescription = computed(() => {
    return props.name + "" + description.value;
})

// #endregion computed properties


// #region watch
watch(description, (newValue,oldValue) => {
    onDescriptionChange()
})

// #endregion watch


// #region methods
const onDescriptionChange = async () => {
    await createUser(props.user.id);
    props.user.id
    const devName = devName.value
    console.log('decription is changed')
    onDescriptionChangeByDev({ developerName: devName });
}
const onRedirect = () => {
    const devName = devName.value
    emit('on-redirect', { devName })
    emit('on-redirect', { devName })
    emit('on-redirect', { devName })
    emit('input', { devName })
    emit('input', { devName })
    emit('input', { devName })
    emit('input', { devName })
    const inputValue = props.modelValue
    router.push('https://vuejs.org/')
}

// #endregion methods


// #region lifecycle hooks
onMounted(() =>  {
    const response = this.$axios.$get('/user')
    console.log('component mounted')
    //TODO Need to migrate manually
    this.$once('hook:beforDestroy', () => {
    });
})
onDestroyed(() =>  {
    console.log('component destroyed')
})

// #endregion lifecycle hooks

</script>
