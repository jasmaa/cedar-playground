import { useEffect, useState } from "react";
import init, {
  authorize,
  AuthorizeInput,
  AuthorizeOutputResponse,
} from "cedar-playground-wasm/cedar_playground_wasm";

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
  const [_errorMsg, _setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      await init();
    })();
  });

  return (
    <>
      <input
        onChange={(e) => {
          setPrincipal(e.target.value);
        }}
        value={principal}
      />
      <input
        onChange={(e) => {
          setAction(e.target.value);
        }}
        value={action}
      />
      <input
        onChange={(e) => {
          setResource(e.target.value);
        }}
        value={resource}
      />
      <textarea
        onChange={(e) => {
          setContext(e.target.value);
        }}
      >
        {context}
      </textarea>
      <textarea
        onChange={(e) => {
          setPolicySet(e.target.value);
        }}
      >
        {policySet}
      </textarea>
      <textarea
        onChange={(e) => {
          setEntities(e.target.value);
        }}
      >
        {entities}
      </textarea>
      <button
        onClick={async () => {
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
            console.log(res.error);
          }
        }}
      >
        Test
      </button>
      {response && (
        <>
          <p>{response.decision}</p>
          <p>{response.diagnostics}</p>
        </>
      )}
    </>
  );
}
