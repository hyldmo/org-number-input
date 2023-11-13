import { ExtensionSettings } from '@shopify/ui-extensions/checkout'

/**
 * See shopify.extension.toml for source of options
 */
export interface AukCheckoutUISettings extends ExtensionSettings {
	'heading': string
	'body': string
}
