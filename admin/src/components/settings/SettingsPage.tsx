import { Page, Layouts } from '@strapi/strapi/admin';
import { Flex, Box, Button, Grid, Typography } from '@strapi/design-system';
import { Information, Check } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { SettingsTextField, SettingsToggleField } from '../../components/settings';
import { useFetchSettings, useUpdateSettings } from '../../utils/api';
import { getTranslation as getTrad } from '../../utils/getTranslation';
import { useQueryClient } from '@tanstack/react-query';

export const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();

  const { data, isLoading } = useFetchSettings('settings', true, false);
  const { mutateAsync: saveSettings, isPending } = useUpdateSettings();

  const handleSubmit = async () => {
    if (!data) return;
    await saveSettings(data);
  };

  const onUpdateSettings = (fieldName: string, value: string | boolean) => {
    if (!data) return;

    try {
      const updatedSettings = { ...data };
      (updatedSettings as any)[fieldName] = value;
      queryClient.setQueryData(['fetch_settings', 'settings'], updatedSettings);
    } catch (e) {
      console.log(e);
    }
  };

  const checkFormErrors = () => {
    return !data?.rank;
  };

  const hasFormError = checkFormErrors();

  return (
    <>
      <Layouts.Header
        id="title"
        title={formatMessage({ id: getTrad('plugin.settings.title') })}
        subtitle={formatMessage({ id: getTrad('plugin.settings.subtitle') })}
        primaryAction={
          isLoading ? (
            <></>
          ) : (
            <Button
              onClick={handleSubmit}
              startIcon={<Check />}
              size="L"
              disabled={isPending || hasFormError}
              loading={isPending}
            >
              {formatMessage({ id: getTrad('plugin.settings.buttons.save') })}
            </Button>
          )
        }
      ></Layouts.Header>
      {isLoading ? (
        <Page.Loading />
      ) : (
        <Layouts.Content>
          <Box
            background="neutral0"
            hasRadius
            shadow="filterShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={7}
            paddingRight={7}
          >
            <Flex direction="column">
              <Box paddingBottom={6}>
                <Typography variant="beta">
                  {formatMessage({ id: getTrad('plugin.settings.field-names') })}
                </Typography>
              </Box>
              <Grid.Root gap={6}>
                {/* rank */}
                <Grid.Item col={6} s={12}>
                  <Box padding={0} style={{ width: '100%' }}>
                    <SettingsTextField
                      hasTooltip={true}
                      hasHint={true}
                      hasLabel={true}
                      hasPlaceholder={true}
                      fieldName="rank"
                      displayName="rank"
                      required={true}
                      updateItem={onUpdateSettings}
                      value={data?.rank}
                    />
                  </Box>
                </Grid.Item>

                {/* title */}
                <Grid.Item col={6} s={12}>
                  <Box padding={0} style={{ width: '100%' }}>
                    <SettingsTextField
                      hasTooltip={true}
                      hasHint={true}
                      hasLabel={true}
                      hasPlaceholder={true}
                      fieldName="title"
                      displayName="title"
                      required={false}
                      updateItem={onUpdateSettings}
                      value={data?.title}
                    />
                  </Box>
                </Grid.Item>

                {/* subtitle */}
                <Grid.Item col={6} s={12}>
                  <Box padding={0} style={{ width: '100%' }}>
                    <SettingsTextField
                      hasTooltip={true}
                      hasHint={true}
                      hasLabel={true}
                      hasPlaceholder={true}
                      fieldName="subtitle"
                      displayName="subtitle"
                      required={false}
                      updateItem={onUpdateSettings}
                      value={data?.subtitle ?? ''}
                    />
                  </Box>
                </Grid.Item>

                <Grid.Item col={6} s={12}>
                  <Box padding={0} style={{ width: '100%' }}>
                    <SettingsToggleField
                      hasTooltip={true}
                      hasHint={true}
                      hasLabel={true}
                      fieldName="triggerWebhooks"
                      displayName="triggerWebhooks"
                      required={false}
                      updateItem={onUpdateSettings}
                      value={data?.triggerWebhooks}
                    />
                  </Box>
                </Grid.Item>
              </Grid.Root>
            </Flex>
          </Box>
        </Layouts.Content>
      )}
    </>
  );
};
