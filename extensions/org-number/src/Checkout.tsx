import {
	BlockStack,
	reactExtension,
	TextField,
	useApplyMetafieldsChange,
	useApplyShippingAddressChange,
	useBuyerJourneyIntercept,
	useMetafield,
	useSettings,
	useTranslate
} from '@shopify/ui-extensions-react/checkout'
import { ExtensionSettings } from '@shopify/ui-extensions/checkout'
import { useState } from 'react'
import { NoVatResponse } from './vatResponse'

/**
 * See shopify.extension.toml for source of options
 */
interface OrgNumberSettings extends ExtensionSettings {
	required: boolean
	validation: boolean
	externalValidation: boolean
	applyOrgName: boolean
}

// Set the entry point for the extension
export default reactExtension('purchase.checkout.block.render', () => <App />)

async function validateOrgNumber(value: string | undefined, settings: Partial<OrgNumberSettings>) {
	const { required = false, validation = false, externalValidation = false } = settings
	if (!value) {
		if (required) return 'org_required'
		else return undefined
	}
	const mva = value.replace('MVA', '')
	if (externalValidation) {
		// bbreg doesn't always return json for some errors, so wrap in try/catch
		let data: NoVatResponse | null = null
		try {
			const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${mva.replace(/\s/g, '')}`)
			if (res.status === 404) return 'org_not_found'
			data = await res.json()
		} catch (e) {
			// Allow errors in case of network issues
			return undefined
		}
		if (!data) return 'org_not_found'
		if ('feilmelding' in data) {
			return { error: data.valideringsfeil[0]?.feilmelding }
		}
		return {
			data: data.navn
		}
	} else if (validation) {
		if (value.replace('MVA', '').match(/^([0-9]{3} ?){3}(MVA)?$/g)) return undefined
		else return 'org_invalid'
	}
	return undefined
}

function App() {
	// Define the metafield namespace and key
	const settings = useSettings<OrgNumberSettings>()
	settings.applyOrgName = true
	settings.externalValidation = true
	settings.required = true

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
	const applyShippingAddressChange = useApplyShippingAddressChange()

	useBuyerJourneyIntercept(async ({ canBlockProgress }) => {
		const res = await validateOrgNumber(orgNumber?.value.toString(), settings)
		const error = typeof res === 'string' ? res : res?.error
		if (error) {
			if (canBlockProgress) {
				return {
					behavior: 'block',
					reason: error,
					perform: (result) => {
						// If progress can be blocked, then set a validation error on the custom field
						if (result.behavior === 'block') {
							setValidationError(typeof res === 'string' ? t(res) : error)
						}
					}
				}
			} else {
				setValidationError(typeof res === 'string' ? t(res) : error)
			}
		} else {
			if (settings.applyOrgName && typeof res === 'object' && 'data' in res) {
				await applyShippingAddressChange({
					type: 'updateShippingAddress',
					address: { company: res.data }
				})
			}
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
				onChange={async (value) => {
					const res = await validateOrgNumber(value, { ...settings, externalValidation: false })
					// Apply the change to the metafield
					setValidationError(res ? (typeof res === 'string' ? t(res) : res.error) : undefined)

					applyMetafieldsChange({
						type: 'updateMetafield',
						namespace: metafieldNamespace,
						key: metafieldKey,
						valueType: 'string',
						value: value.toString()
					})
				}}
				value={orgNumber?.value.toString()}
				error={validationError}
			/>
		</BlockStack>
	)
}
