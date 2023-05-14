import { useEffect, useState } from "react";
import init, {
  authorize,
  AuthorizeInput,
  AuthorizeOutputResponse,
  initConsoleErrorPanicHook,
} from "cedar-playground-wasm/cedar_playground_wasm";
import {
  Input,
  Container,
  FormField,
  Header,
  SpaceBetween,
  Box,
  Grid,
  Textarea,
  Button,
  StatusIndicator,
  Flashbar,
  Form,
} from "@cloudscape-design/components";

const INITIAL_PRINCIPAL = `User::"alice"`;
const INITIAL_ACTION = `Action::"view"`;
const INITIAL_RESOURCE = `Album::"trip"`;
const INITIAL_CONTEXT = `{}`;
const INITIAL_POLICY_SET = `permit(
  principal == User::"alice",
  action == Action::"view",
  resource == Album::"trip"
);`;
const INITIAL_ENTITIES = `[
  {
        "uid": {"type":"User","id":"alice"},
        "attrs": {
            "age":17,
            "ip_addr":{"__extn":{"fn":"ip", "arg":"10.0.1.101"}}
        },
        "parents": []
    },
    {
        "uid":{"type":"Action","id":"view"},
        "attrs": {},
        "parents": []
    },
    {
        "uid": {"__entity":{"type":"Album","id":"trip"}},
        "attrs": {},
        "parents": []
    }
]
`;

export default function App() {
  const [principal, setPrincipal] = useState(INITIAL_PRINCIPAL);
  const [action, setAction] = useState(INITIAL_ACTION);
  const [resource, setResource] = useState(INITIAL_RESOURCE);
  const [context, setContext] = useState(INITIAL_CONTEXT);
  const [policySet, setPolicySet] = useState(INITIAL_POLICY_SET);
  const [entities, setEntities] = useState(INITIAL_ENTITIES);
  const [response, setResponse] = useState<AuthorizeOutputResponse>();
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      await init();
      await initConsoleErrorPanicHook();
    })();
  }, []);

  return (
    <Box margin="m">

      <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
        <SpaceBetween size="l" direction="vertical">
          <Container header={<Header variant="h2">Policy Set</Header>}>
            <SpaceBetween size="m" direction="vertical">
              <Textarea
                onChange={(e) => {
                  setPolicySet(e.detail.value);
                }}
                value={policySet}
                rows={10}
              />
            </SpaceBetween>
          </Container>
          <Container header={<Header variant="h2">Entities</Header>}>
            <SpaceBetween size="m" direction="vertical">
              <Textarea
                onChange={(e) => {
                  setEntities(e.detail.value);
                }}
                value={entities}
                rows={10}
              />
            </SpaceBetween>
          </Container>
        </SpaceBetween>
        <SpaceBetween size="l" direction="vertical">
          <Container header={<Header variant="h2">Request</Header>}>
            <form onSubmit={(e) => {
              e.preventDefault();
              setResponse(undefined);
              setErrorMsg("");
              setIsLoadingResponse(true);
              (async () => {
                const res = authorize(
                  new AuthorizeInput(
                    principal,
                    action,
                    resource,
                    context,
                    policySet,
                    entities,
                    undefined
                  )
                );
                if (!res.error) {
                  setResponse(res.response!);
                } else {
                  setErrorMsg(res.error);
                }
                setIsLoadingResponse(false);
              })();
            }}>
              <Form actions={<SpaceBetween size="m" direction="horizontal">
                <Button loading={isLoadingResponse}>
                  Test!
                </Button>
              </SpaceBetween>}>
                <SpaceBetween size="m" direction="vertical">
                  <FormField label="Principal">
                    <Input
                      onChange={(e) => {
                        setPrincipal(e.detail.value);
                      }}
                      value={principal}
                    />
                  </FormField>
                  <FormField label="Action">
                    <Input
                      onChange={(e) => {
                        setAction(e.detail.value);
                      }}
                      value={action}
                    />
                  </FormField>
                  <FormField label="Resource">
                    <Input
                      onChange={(e) => {
                        setResource(e.detail.value);
                      }}
                      value={resource}
                    />
                  </FormField>
                  <FormField label="Context">
                    <Textarea
                      onChange={(e) => {
                        setContext(e.detail.value);
                      }}
                      value={context}
                    />
                  </FormField>
                </SpaceBetween>
              </Form>
            </form>
          </Container>
          <Container header={<Header variant="h2">Response</Header>}>
            {errorMsg && (
              <Flashbar
                items={[
                  {
                    header: "Failed to process request",
                    type: "error",
                    content: errorMsg,
                  },
                ]}
              />
            )}
            {response ? (
              response.decision === "ALLOW" ? (
                <StatusIndicator type="success">
                  {response.decision}
                </StatusIndicator>
              ) : response.decision === "DENY" ? (
                <StatusIndicator type="error">
                  {response.decision}
                </StatusIndicator>
              ) : (
                <StatusIndicator type="loading">Unknown</StatusIndicator>
              )
            ) : null}
          </Container>
        </SpaceBetween>
      </Grid >
    </Box >
  );
}
