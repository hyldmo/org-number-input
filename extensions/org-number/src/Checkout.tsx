import {
	BlockStack,
	reactExtension,
	TextField,
	useApplyMetafieldsChange,
	useBuyerJourneyIntercept,
	useMetafield,
	useSettings,
	useTranslate
} from '@shopify/ui-extensions-react/checkout'
import { ExtensionSettings } from '@shopify/ui-extensions/checkout'
import { useState } from 'react'

/**
 * See shopify.extension.toml for source of options
 */
interface OrgNumberSettings extends ExtensionSettings {
	required: boolean
	validation: boolean
}

// Set the entry point for the extension
export default reactExtension('purchase.checkout.block.render', () => <App />)

function validateOrgNumber(value: string | undefined, settings: Partial<OrgNumberSettings>) {
	const { required = true, validation = true } = settings
	if (!value) {
		if (required) return 'org_required'
		else return undefined
	}
	if (validation) {
		if (value.replace('MVA', '').match(/^([0-9]{3} ?){3}(MVA)?$/g)) return undefined
		else return 'org_invalid'
	}
	return undefined
}

function App() {
	// Define the metafield namespace and key
	const settings = useSettings<OrgNumberSettings>()
	const metafieldNamespace = 'adluna'
	const metafieldKey = 'org_number'
	const [validationError, setValidationError] = useState<string>()
	const t = useTranslate()

	// Get a reference to the metafield
	const orgNumber = useMetafield({
		namespace: metafieldNamespace,
		key: metafieldKey
	})
	// Set a function to handle updating a metafield
	const applyMetafieldsChange = useApplyMetafieldsChange()

	useBuyerJourneyIntercept(({ canBlockProgress }) => {
		const error = validateOrgNumber(orgNumber?.value.toString(), settings)
		if (canBlockProgress && error) {
			return {
				behavior: 'block',
				reason: error,
				perform: (result) => {
					// If progress can be blocked, then set a validation error on the custom field
					if (result.behavior === 'block') {
						setValidationError(t(error))
					}
				}
			}
		} else {
			setValidationError(undefined)
			return {
				behavior: 'allow'
			}
		}
	})

	return (
		<BlockStack>
			<TextField
				id={metafieldKey}
				label={t('org_label')}
				required
				onInput={() => {
					setValidationError(undefined)
				}}
				onChange={(value) => {
					const error = validateOrgNumber(value, settings)
					// Apply the change to the metafield
					setValidationError(error ? t(error) : undefined)

					applyMetafieldsChange({
						type: 'updateMetafield',
						namespace: metafieldNamespace,
						key: metafieldKey,
						valueType: 'string',
						value: value.replace(/\s/g, '')
					})
				}}
				value={orgNumber?.value.toString()}
				error={validationError}
			/>
		</BlockStack>
	)
}
