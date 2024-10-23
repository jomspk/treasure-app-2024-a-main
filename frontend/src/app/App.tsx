import { User as FirebaseUser } from "firebase/auth";
import { useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CurrentFirebaseUserContext } from "../globalState/currentUser";
import QuestionPage from "./[id]";
import CreatePage from "./question/createPage";
import Root from "./root";
import Top from "./top";

interface Props {
  firebaseUser: FirebaseUser | null;
}

function App(props: Props) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(
    props.firebaseUser,
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          index: true,
          element: <Top />,
        },
        {
          path: "/question/:questionId",
          element: <QuestionPage />,
        },
        {
          path: "/question/create",
          element: <CreatePage />,
        },
      ],
    },
  ]);

  return (
    <CurrentFirebaseUserContext.Provider value={[currentUser, setCurrentUser]}>
      <RouterProvider router={router} />
    </CurrentFirebaseUserContext.Provider>
  );
}

export default App;
