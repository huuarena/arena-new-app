import { useEffect, useState } from 'react'
import StoreSettingApi from './apis/store_setting'
import { NavigationMenu, Toast } from '@shopify/app-bridge-react'
import Preloader from './components/Preloader'
import Privacy from './components/Privacy'
import { Page } from '@shopify/polaris'
import LoadingPage from './components/LoadingPage'
import { AppBridgeProvider, PolarisProvider, QueryProvider } from './components'
import { BrowserRouter } from 'react-router-dom'
import AppFullscreen from './components/AppFullscreen'
import App from './App'
import ConfirmModal from './components/ConfirmModal'

function AppContainer(props) {
  const { actions, storeSetting, notify, appLoading } = props

  const [isReady, setIsReady] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  useEffect(() => {
    if (['haloha-shop.myshopify.com'].includes(window.shopOrigin)) {
      console.log('appProps :>> ', props)
    }

    if (!isReady && props.storeSetting && props.privacy && props.uniqueCodes && props.duplicators) {
      setIsReady(true)
    }
  }, [props])

  useEffect(() => {
    actions.getStoreSetting()
    actions.getPrivacy()
    actions.getUniqueCodes()
    actions.getDuplicators()

    actions.getThemes()
    actions.getFaqs()
  }, [])

  const acceptPrivacy = async () => {
    try {
      actions.showAppLoading()
      await actions.updateStoreSetting({ acceptedAt: new Date().toISOString() })
      actions.showNotify({ message: 'Privacy accepted' })
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const toastMarkup = notify?.show && (
    <Toast
      error={notify.error}
      content={notify.message}
      onDismiss={() => {
        if (notify.onDismiss) {
          notify.onDismiss()
        }
        actions.hideNotify()
      }}
    />
  )

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: 'Home',
                  destination: '/',
                },
                {
                  label: 'Export',
                  destination: '/export',
                },
                {
                  label: 'Import',
                  destination: '/import',
                },
              ]}
            />

            <AppFullscreen isFullscreen={isFullscreen}>
              <Page fullWidth={isFullscreen}>
                {isReady ? (
                  storeSetting.acceptedAt ? (
                    <App
                      {...props}
                      isFullscreen={isFullscreen}
                      onToggleFullscreen={() =>
                        isFullscreen ? setOpenConfirmModal(true) : setIsFullscreen(!isFullscreen)
                      }
                    />
                  ) : (
                    <Page fullWidth>
                      <Privacy {...props} onAction={acceptPrivacy} />
                    </Page>
                  )
                ) : (
                  <Preloader />
                )}
              </Page>
            </AppFullscreen>

            {appLoading?.loading && <LoadingPage {...appLoading} />}

            {toastMarkup}

            {openConfirmModal && (
              <ConfirmModal
                title="Are you sure you want to exit fullscreen?"
                content="Confirm to leave the fullscreen."
                onClose={() => setOpenConfirmModal(false)}
                secondaryActions={[
                  {
                    content: 'No, I want to stay',
                    onAction: () => setOpenConfirmModal(false),
                  },
                  {
                    content: 'Yes, I am sure',
                    onAction: () => {
                      setOpenConfirmModal(false)
                      setIsFullscreen(false)
                    },
                    primary: true,
                  },
                ]}
              />
            )}
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  )
}

export default AppContainer
