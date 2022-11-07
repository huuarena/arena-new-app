import EnvatoApi from '../apis/envato.js'
import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'

export default {
  submit: async (req, res) => {
    console.log('\n----------------------------------------')
    console.log('/api/submition')
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = {}

      data = {
        amount: '56.00',
        sold_at: '2022-02-18T03:32:28+11:00',
        license: 'Regular License',
        support_amount: '0.00',
        supported_until: '2022-08-19T17:32:28+10:00',
        item: {
          id: 22974725,
          name: 'Chromium — Auto Parts Shop Shopify Theme',
          number_of_sales: 1016,
          author_username: 'arenacommerce',
          author_url: 'https://themeforest.net/user/arenacommerce',
          url: 'https://themeforest.net/item/chromium-auto-parts-shop-shopify-theme/22974725',
          updated_at: '2022-08-01T20:08:45+10:00',
          attributes: [
            {
              name: 'columns',
              value: null,
              label: 'Columns',
            },
            {
              name: 'compatible-browsers',
              value: ['Firefox', 'Safari', 'Opera', 'Chrome', 'Edge'],
              label: 'Compatible Browsers',
            },
            {
              name: 'compatible-software',
              value: ['Shopify 2.0'],
              label: 'Software Version',
            },
            {
              name: 'compatible-with',
              value: null,
              label: 'Compatible With',
            },
            {
              name: 'demo-url',
              value: 'https://landing.arenacommerce.com/chromium',
              label: 'Demo URL',
            },
            {
              name: 'documentation',
              value: 'Well Documented',
              label: 'Documentation',
            },
            {
              name: 'high-resolution',
              value: 'Yes',
              label: 'High Resolution',
            },
            {
              name: 'layout',
              value: 'Responsive',
              label: 'Layout',
            },
            {
              name: 'themeforest-files-included',
              value: ['CSS Files', 'JS Files'],
              label: 'ThemeForest Files Included',
            },
          ],
          description:
            '<p>Chromium 4.0 Update Shopify OS 2.0 Theme Schema</p>\n\n<p>Chromium is a great premium auto parts Shopify theme. We designed it to make your site prettier and your life easier. The theme is fast, modern, and features great plugins and theme options. Why? Because they facilitate the process of theme tuning</p>\n<p>\n<a href="https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fchromium3.arenacommerce.com%2F" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/1.png" alt="responsive shopify theme" /></a>\n<a href="https://landing.arenacommerce.com/chromium/" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/2.png" alt="responsive shopify theme" /></a>\n<a href="https://landing.arenacommerce.com/chromium/" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/3.png" alt="responsive shopify theme" /></a>\n<a href="https://landing.arenacommerce.com/chromium/" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/4.png" alt="responsive shopify theme" /></a>\n<a href="https://landing.arenacommerce.com/chromium/" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/5.png" alt="responsive shopify theme" /></a>\n<a href="https://landing.arenacommerce.com/chromium/" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/6.png" alt="responsive shopify theme" /></a>\n<a href="https://landing.arenacommerce.com/chromium/" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/7.png" alt="responsive shopify theme" /></a>\n<a href="https://landing.arenacommerce.com/chromium/" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/8.png" alt="responsive shopify theme" /></a>\n<a href="https://landing.arenacommerce.com/chromium/" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/9.png" alt="responsive shopify theme" /></a>\n<a href="https://landing.arenacommerce.com/chromium/" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/10.png" alt="responsive shopify theme" /></a>\n<a href="https://landing.arenacommerce.com/chromium/" rel="nofollow"><img src="https://cdn.arenacommerce.com/landing/chromium/11.png" alt="responsive shopify theme" /></a>\n\n</p>\n<h2 id="item-description__full-featured-list">FULL FEATURED LIST</h2> \n<h3 id="item-description__general">General</h3>\n<ul> \n<li> \n<strong>Outstanding Support</strong> \n</li> \n<li> \n<strong>Lifetime free updates</strong> \n</li> \n<li>100% fully Responsive, Bootstrap 4, HTML5 &#38; CSS3 &#38; SASS</li>\n<li><strong>Unlimited Color Options</strong></li> \n<li><strong>Prefined Style Page; Contact Page</strong></li> \n<li><strong>New: Shopify#8217;s font library:</strong> The library includes system fonts, a selection of Google fonts, and licensed fonts from Monotype.</li> \n<li><strong>New: Advanced Typography Options</strong></li>\n<li>Support Free Customer Reviews Shopify App</li> \n<li>Support Free FAQs Shopify App</li>\n<li>Support Multi-language by Google Translate</li>\n<li>Free Threshold Shipping</li>\n<li><strong>New:</strong>Fomo Popups display <strong>real-time customer activity notifications on your store</strong>. You can use it as a Social Proof Marketing Tool to Boost Conversions</li>\n<li><strong>New:</strong>Multi Currency with Free Auto Currency Switcher by location</li>\n<li><strong>New:</strong> Free Shopify App: <strong>Product Wishlist &#38; Compare</strong></li> \n<li><strong>New:</strong> Free Shopify App: <strong>Arena Installation</strong></li>\n<li><strong>New:</strong> Catalog Mode: Disable Add to cart function</li>\n<li><strong>New:</strong> Custom Ajax Cart Mode: Disable Ajax cart function to adapt some Shopify apps</li>\n<li><strong>Layout Mode: Wide &#38; Boxed</strong></li> \n<li><strong>Multi Store Header &#38; Footer Styles</strong></li>\n<li><strong>Mega Menu: 3 Vertical &#38; Horizontal Mega Menus</strong></li> \n<li><strong>EU Privacy Notification: free GDPR compliance for cookies, auto detect location turn on</strong></li>\n<li><strong>Mobile Touch Slideshow support multi layer images, video</strong></li> \n<li><strong>Lazy Loading</strong> Optimize Website Speed Loading </li>\n<li><strong>New: Newsletter Popup Intent Exit Detection</strong></li>\n<li>Collection Grid &#38; List Options</li>\n<li>Collection Full Width &#38; Sidebar</li> \n<li>Collection Advantage Ajax Filter</li> \n<li><strong>Auto Height Options: Adjust all images to the same height</strong></li>\n<li><strong>New: Product Bundle Template</strong></li> \n<li><strong>Product Intend Exit Coupon Popups &#8211; Auto Apply Coupon Code at Checkout</strong></li>\n<li><strong>Product Deal Count Down Timer</strong></li>\n<li>Product Carousel</li> \n<li>Product Sale Label</li> \n<li>Product Hover Options &#38; Quick View</li> \n<li>Sharing Social</li> \n<li>Browser comparison</li>\n<li>Mobile UX Optimize</li>\n<li>Google Mobile Friendly</li> \n<li>SEO optimized : Speed, Google&#8217;s Rich Snippet, heading, title&#8230;</li> \n<li><strong> And Much More! Check out the various demos!</strong></li> \n</ul> \n\n<h2 id="item-description__change_logs">Updates</h2>\n<pre> Aug 01 2022 - Update 4.0</pre>\n<ul>\n<li>Major update: Update Shopify OS 2.0 Schema</li>\n</ul>\n<pre>Jul 28 2021 - Update 3.0</pre>\n<ul>\n<li>Major update</li>\n</ul>\n<pre>Aug 15th 2019 - Update 2.0</pre>\n<ul>\n<li>Fixed layout: boxed-wide</li>\n<li>Navigation improvement</li>\n</ul>',
          site: 'themeforest.net',
          classification: 'ecommerce/shopify/miscellaneous',
          classification_url: 'https://themeforest.net/category/ecommerce/shopify/miscellaneous',
          price_cents: 8900,
          author_image: 'https://s3.envato.com/files/331031236/Group%202.3%20(1).png',
          summary:
            'High Resolution: Yes, Compatible Browsers: Firefox, Safari, Opera, Chrome, Edge, Software Version: Shopify 2.0',
          rating: 4.88,
          rating_count: 25,
          published_at: '2018-12-15T05:19:50+11:00',
          trending: false,
          tags: [
            'auto dealer',
            'auto parts',
            'auto shop',
            'bike parts',
            'boat',
            'car repair',
            'garage',
            'marketplace',
            'motorcycle shop',
            'responsive',
            'shop',
            'shopify theme',
            'spare parts',
            'tuning shop',
          ],
          previews: {
            live_site: {
              href: '/item/chromium-auto-parts-shop-shopify-theme/full_screen_preview/22974725',
              type: 'live_site',
            },
            icon_with_landscape_preview: {
              icon_url: 'https://s3.envato.com/files/269330996/small.png',
              landscape_url: 'https://s3.envato.com/files/349993067/chromium3.__large_preview.png',
              type: 'icon_with_landscape_preview',
            },
            landscape_preview: {
              landscape_url: 'https://s3.envato.com/files/349993067/chromium3.__large_preview.png',
              type: 'landscape_preview',
            },
            icon_preview: {
              icon_url: 'https://s3.envato.com/files/269330996/small.png',
              type: 'icon_preview',
            },
          },
        },
        buyer: 'vegherno',
        purchase_count: 3,
      }

      data = await EnvatoApi.verifyCode({ code: '2ceb84f9-a9b1-4a3a-aeef-5c17cd7b65c0' })

      console.log('/api/submition data :>> ', data)
      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
