import express from 'express'
import cors from 'cors'
import { getSubtitles } from 'youtube-caption-extractor'

const app = express()
const PORT = 3000
app.use(cors())

app.get('/api/subtitles', async (req, res) => {

    const { videoId, lang } = req.query;

    if (typeof videoId !== 'string' || typeof lang !== 'string') {
        res.status(400).json({ error: 'Invalid parameters' });
        return;
    }

    const videoID = videoId

    try {
        const subtitles = await getSubtitles({ videoID, lang })
        return res.status(200).json({ subtitles })
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
})

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`)
})
