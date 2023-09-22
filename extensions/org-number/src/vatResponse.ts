export type NoVatResponse = NoVatResponseOK | NoVatResponseError

export interface NoVatResponseError {
	tidsstempel: number
	status: number
	feilmelding: string
	sti: string
	antallFeil: number
	valideringsfeil: Valideringsfeil[]
}

export interface Valideringsfeil {
	feilmelding: string
	parametere: string[]
	feilaktigVerdi: string
}

export interface NoVatResponseOK {
	organisasjonsnummer: string
	navn: string
	organisasjonsform: Organisasjonsform
	registreringsdatoEnhetsregisteret: string
	registrertIMvaregisteret: boolean
	naeringskode1: Naeringskode1
	antallAnsatte: number
	forretningsadresse: Forretningsadresse
	stiftelsesdato: string
	institusjonellSektorkode: InstitusjonellSektorkode
	registrertIForetaksregisteret: boolean
	registrertIStiftelsesregisteret: boolean
	registrertIFrivillighetsregisteret: boolean
	sisteInnsendteAarsregnskap: string
	konkurs: boolean
	underAvvikling: boolean
	underTvangsavviklingEllerTvangsopplosning: boolean
	maalform: string
	_links: Links2
}

export interface Organisasjonsform {
	kode: string
	beskrivelse: string
	_links: Links
}

export interface Links {
	self: Self
}

export interface Self {
	href: string
}

export interface Naeringskode1 {
	beskrivelse: string
	kode: string
}

export interface Forretningsadresse {
	land: string
	landkode: string
	postnummer: string
	poststed: string
	adresse: string[]
	kommune: string
	kommunenummer: string
}

export interface InstitusjonellSektorkode {
	kode: string
	beskrivelse: string
}

export interface Links2 {
	self: Self2
}

export interface Self2 {
	href: string
}
