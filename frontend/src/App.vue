<script setup lang="ts">
import { usePlayer } from '@vue-youtube/core'
import { ref, onMounted } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import axios from 'axios'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface Subtitle {
  dur: string
  start: string
  text: string
}

const youtube = ref()
const videoId = ref()
let subtitles: Subtitle[] = []
const currentSubtitle = ref('')
const { toast } = useToast()

const { onStateChange, onError, instance } = usePlayer(videoId, youtube)

onStateChange(() => {
  currentSubtitle.value = getSubtitle(instance.value?.getCurrentTime())
  console.log(currentSubtitle.value)
})

onError((event) => {
  console.error('Error loading video: ', event)
})

const youtube_parser = (url: string) => {
  const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[1].length == 11 ? match[1] : false
}

const fetchSubtitles = async (videoId: string, lang: string) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/subtitles?videoId=${videoId}&lang=${lang}`
    )

    const data = res.data
    subtitles = data.subtitles
    return subtitles === undefined ? true : subtitles.length == 0 ? true : false
  } catch (error) {
    console.error('Error fetching subtitles (server down, etc.):', error)
    return undefined
  }
}

const getSubtitle = (currentTime: number | undefined) => {
  if (currentTime === undefined || subtitles === undefined || subtitles.length === 0) {
    return ''
  }

  let subtitle: string | undefined = ''

  if (currentTime <= parseFloat(subtitles[0].start)) {
    subtitle = subtitles[0].text
  } else {
    subtitle = subtitles.filter((sub: Subtitle) => parseFloat(sub.start) <= currentTime).pop()?.text
  }

  if (subtitle === undefined) {
    return ''
  }

  return subtitle
}

const formSchema = toTypedSchema(
  z.object({
    link: z.string(),
    lang: z.string({
      required_error: 'Please select a language to display.'
    })
  })
)

const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit(async (values) => {
  const id = youtube_parser(values.link)

  if (!id) {
    toast({
      title: 'Invalid link!',
      description: 'Please try again.',
      variant: 'destructive'
    })
    return
  }

  const isMissingSubtitles = await fetchSubtitles(id, values.lang)

  if (isMissingSubtitles === undefined) {
    toast({
      title: 'Error fetching subtitles!',
      description: 'Please try again.',
      variant: 'destructive'
    })
  } else if (isMissingSubtitles) {
    toast({
      title: 'No track for language specified.',
      description: 'Please try again.',
      variant: 'destructive'
    })
  }

  videoId.value = id
})

// Allows concurrent subtitles that match the video
onMounted(() => {
  setInterval(() => {
    currentSubtitle.value = getSubtitle(instance.value?.getCurrentTime())
  }, 800)
})

</script>

<template>
  <div>
    <div class="overflow-auto overscroll-y-none">
      <div class="flex min-h-screen w-screen flex-col border">
        <div class="flex items-center border h-20">
          <h1 class="ml-10 text-3xl">りかい</h1>
        </div>

        <main class="mt-4 mb-20 flex flex-col justify-center items-center">
          <div
            class="w-[400px] h-[200px] sm:w-[500px] sm:h-[300px] md:w-[600px] md:h-[400px]"
            ref="youtube"
          />
          <div class="my-4">
            <form @submit="onSubmit">
              <div class="flex flex-col space-y-2 justify-center">
                <FormField v-slot="{ componentField }" name="link">
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="YouTube Link" v-bind="componentField" />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="lang">
                  <FormItem>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="en"> English </SelectItem>
                          <SelectItem value="ja"> Japanese </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                </FormField>
                <Button type="submit"> Find Video </Button>
              </div>
            </form>
          </div>
          <div class="border-t-2 pt-4 h-8 w-3/4 font-semibold text-2xl text-center align-middle">
            {{ currentSubtitle }}
          </div>
        </main>
      </div>
    </div>
  </div>
  <Toaster />
</template>
