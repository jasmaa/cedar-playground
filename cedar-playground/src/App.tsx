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
      <SpaceBetween size="m" direction="vertical">
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          <Container header={<Header variant="h2">Configuration</Header>}>
            <SpaceBetween size="m" direction="vertical">
              <FormField label="Policy Set">
                <Textarea
                  onChange={(e) => {
                    setPolicySet(e.detail.value);
                  }}
                  value={policySet}
                />
              </FormField>
              <FormField label="Entities">
                <Textarea
                  onChange={(e) => {
                    setEntities(e.detail.value);
                  }}
                  value={entities}
                />
              </FormField>
            </SpaceBetween>
          </Container>
          <Container header={<Header variant="h2">Request</Header>}>
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
          </Container>
        </Grid>
        <Container header={<Header variant="h2">Response</Header>}>
          <SpaceBetween size="m" direction="vertical">
            <Button
              onClick={() => {
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
              }}
            >
              Test!
            </Button>
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
            {!isLoadingResponse && response ? (
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
            ) : isLoadingResponse ? (
              <StatusIndicator type="loading">Loading...</StatusIndicator>
            ) : null}
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Box>
  );
}
