const enabled = 'error' // Used to set error level across rules

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
	root: true,
	extends: ['auk'],
	rules: {
		'prettier/prettier': 'off',
		'react/react-in-jsx-scope': 'off',
		'no-console': [enabled]
	}
}
