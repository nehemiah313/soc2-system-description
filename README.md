# SOC 2 System Description Skeleton Generator

Generates a first-draft SOC 2 system description, the narrative every SOC 2 report requires.

Enter company info, services, system boundaries, commitments, infrastructure, software and data
flows, organizational structure, subservice organizations, and complementary user entity controls
(CUECs). Select which optional Trust Services Categories are in scope (Security is always
included). The app produces a structured Markdown skeleton with a `[DESCRIBE CONTROL HERE]`
placeholder under every in-scope criterion, ready to download or copy.

## Data

`data/tsc.json` is a copy of the machine-readable AICPA 2017 Trust Services Criteria dataset
(61 criteria: 33 Security, 3 Availability, 5 Processing Integrity, 2 Confidentiality, 18 Privacy),
from [nehemiah313/tsc-dataset](https://github.com/nehemiah313/tsc-dataset).

## Use

Open `index.html` in a browser, or serve the directory with any static server. No build step,
no external CDNs, works offline. Form state persists in `localStorage` under the key
`soc2sysdesc`.

## Disclaimer

Drafting aid only. This skeleton is a starting point, not a complete system description.
Not an audit, attestation, CPA opinion, or legal advice.

## License

MIT. See LICENSE.
