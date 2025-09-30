import type { Browser } from 'playwright'
import { db } from '@roll-stack/database'
import { chromium } from 'playwright'

const logger = useLogger('yandex:update-data')

export default defineTask({
  meta: {
    name: 'yandex:update-data',
    description: 'Check if it is time to update data from Yandex',
  },
  async run() {
    // Wait 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000))

    const browser = await chromium.launch()

    let points = await db.feedback.listFeedbackPointsToUpdate()

    // Update only one point
    points = points.filter((point) => point.type === 'yandex_map').slice(0, 1)

    for (const point of points) {
      try {
        const data = await getDataFromYandex(browser, point.url)

        logger.log(
          'updated',
          point.url,
          point,
          data.aggregateRating,
          'latest review',
          data.reviews[0],
        )

        await db.feedback.updateFeedbackPoint(point.id, {
          reviews: data.aggregateRating.reviews,
          rating: data.aggregateRating.rating,
          ratings: data.aggregateRating.ratings,
        })

        // Check and update reviews
        for (const review of data.reviews) {
          // Already exist?
          const existReview = await db.client.findReviewIfExists({
            kitchenId: point.kitchenId,
            name: review.name,
            date: review.date,
          })
          if (existReview) {
            continue
          }

          await db.client.createReview({
            createdAt: review.date,
            feedbackPointId: point.id,
            kitchenId: point.kitchenId,
            text: review.text,
            name: review.name,
            rating: Number(review.rating) * 2, // from 1 to 10
          })
        }
      } catch (error) {
        logger.error('Error on point', point, error)
      }
    }

    await browser.close()

    return { result: true }
  },
})

async function getDataFromYandex(browser: Browser, url: string) {
  const page = await browser.newPage()

  await page.setViewportSize({ width: 450, height: 600 })
  await page.goto(url)

  // Wait full page load
  await page.waitForLoadState('networkidle')
  await new Promise((resolve) => setTimeout(resolve, 4000))

  // Click on button with class "rating-ranking-view"
  await page.locator('.rating-ranking-view').click()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // Click on second button in class "rating-ranking-view__popup"
  const buttons = await page.$$('.rating-ranking-view__popup-line')
  await buttons[1]?.click()

  // Wait
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Get rating
  const aggregateRating = await page.$eval('.business-summary-rating', (el) => {
    return {
      reviews: Number(el.querySelector('meta[itemprop="reviewCount"]')?.getAttribute('content')),
      rating: Number(el.querySelector('meta[itemprop="ratingValue"]')?.getAttribute('content')),
      ratings: Number(el.querySelector('meta[itemprop="ratingCount"]')?.getAttribute('content')),
    }
  })

  // Need to find all divs with class "business-review-view"
  const reviews = await page.$$eval('.business-review-view', (elements) => elements.map((el) => {
    return {
      name: el.querySelector('span[itemprop="name"]')?.innerHTML,
      date: el.querySelector('meta[itemprop="datePublished"]')?.getAttribute('content'),
      text: el.querySelector('.spoiler-view__text-container')?.innerHTML,
      rating: el.querySelector('meta[itemprop="ratingValue"]')?.getAttribute('content'),
    }
  }))

  return {
    aggregateRating,
    reviews,
  }
}
