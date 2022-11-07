import { Card, RadioButton, Select, Stack, TextField } from '@shopify/polaris'

const TYPES = [
  { label: 'Create new theme', value: 'create' },
  { label: 'Import to existing theme', value: 'update' },
]

function ImportTheme(props) {
  const { themes, formData, onChange } = props

  return (
    <Card title="Import theme">
      <Card.Section title="Select import theme type" subdued>
        <Stack alignment="center">
          {TYPES.map((item, index) => (
            <Stack key={index}>
              <RadioButton
                name="types"
                label={item.label}
                checked={item.value === formData['themeType'].value}
                onChange={() => onChange('themeType', item.value)}
              />
            </Stack>
          ))}
        </Stack>
      </Card.Section>

      {formData['themeType'].value === 'create' && (
        <Card.Section title="Create new theme" subdued>
          <TextField
            {...formData['themeName']}
            onChange={(value) => onChange('themeName', value)}
          />
        </Card.Section>
      )}

      {formData['themeType'].value === 'update' && (
        <Card.Section title="Update exist theme" subdued>
          <Select
            {...formData['themeId']}
            onChange={(value) => onChange('themeId', value)}
            options={themes.map((item) => ({
              label: `${item.name}${item.role === 'main' ? ` (Published)` : ``}`,
              value: '' + item.id,
            }))}
          />
        </Card.Section>
      )}
    </Card>
  )
}

export default ImportTheme
