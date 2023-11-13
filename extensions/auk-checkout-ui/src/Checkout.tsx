import {
	BlockStack,
	Heading,
	Image,
	reactExtension,
	useSettings,
	useTranslate
} from '@shopify/ui-extensions-react/checkout'
import { AukCheckoutUISettings } from './types'

export default reactExtension('purchase.checkout.block.render', () => <Extension />)

function Extension() {
	const t = useTranslate()

	const settings = useSettings<AukCheckoutUISettings>()

	return (
		<BlockStack>
			<Image source="/assets/api/checkout-extensions/checkout/components/image-example-code.png" />
			<Heading level={2}>{settings.heading ?? t('heading')}</Heading>
			<Heading level={3}>{settings.body ?? t('body')}</Heading>
		</BlockStack>
	)
}
