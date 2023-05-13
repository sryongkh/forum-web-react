import React, { useRef, useEffect } from "react";
import { User, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../../firebase";

import "./newTopicForm.css";
import {
  createTopics,
  updateTopic,
  fetchCategories,
  fetchTags,
} from "../../../api";

import { Category } from "../../forumPage/forumPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { TransitionProps } from "@mui/material/transitions";

import { Editor } from "@tinymce/tinymce-react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface NewTopicFormProps {
  isOpen: boolean;
  onRequestClose: () => void;
  categoryName: string;
  onSubmit: (
    uid: string,
    displayName: string,
    title: string,
    categoryName: string,
    tags: string[],
    body: string,
    postedDate: string
  ) => void;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const present = new Date();
const dateString = present.toLocaleDateString();
const timeString = present.toLocaleTimeString();

const NewTopicForm: React.FC<NewTopicFormProps> = ({
  isOpen,
  categoryName,
  onRequestClose,
  onSubmit
}) => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  // const [text, setText] = React.useState("");
  const [wordCount, setWordCount] = React.useState(100);
  const [topicTitle, setTopicTitle] = React.useState("");
  const [topicBody, setTopicBody] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  // const [topic, setTopic] = React.useState("");
  const [categories, setCategories] = React.useState<Category[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    const charCount = inputText.length;
    if (charCount <= 100) {
      setWordCount(100 - charCount);
    }
  };

  const handleEditorChange = (content: string, editor: any) => {
    setTopicBody(content);
  };

  const handleSubmitNewTopic = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    const postedDate = dd + "/" + mm + "/" + yyyy;

    if (currentUser !== null) {
      const displayName =
        currentUser.displayName !== null ? currentUser.displayName : "";
      createTopics(
        currentUser.uid,
        displayName,
        topicTitle,
        category,
        selectedTags,
        topicBody,
        postedDate
      );
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchAllTags = async () => {
      const tags = await fetchTags();
      setTags(tags.tags.map((tag: any) => tag.tagName).flat());
    };

    fetchCategories(setCategories);
    fetchAllTags();
  }, []);

  return (
    <>
      <Dialog
        id="new-topic-dialog"
        open={isOpen}
        onClose={onRequestClose}
        fullScreen
        TransitionComponent={Transition}
        transitionDuration={500}
        PaperProps={{
          style: {
            borderTopLeftRadius: "8rem",
            borderTopRightRadius: "8rem",
            height: "97%",
            marginTop: "auto",
          },
        }}
      >
        <div id="modal-page">
          <FontAwesomeIcon
            id="close-button"
            icon={faXmark}
            onClick={onRequestClose}
          />
          <form onSubmit={handleSubmitNewTopic}>
            <div className="flex flex-col">
              <div id="data-topic" className="mt-32 px-8">
                <label className="font-medium" htmlFor="input-topic-title">
                  Topics Title
                </label>

                <div className="rounded-md bg-zinc-200 px-4 py-2 flex items-center">
                  <input
                    id="input-topic-title"
                    type="text"
                    placeholder="Subject of your topic"
                    className={`w-full bg-transparent`}
                    onChange={(event) => {
                      handleInputChange(event),
                        setTopicTitle(event.target.value);
                    }}
                  />
                  <span className="text-md">{`${wordCount}`}</span>
                </div>

                <div className="mt-4 flex flex-col">
                  <label className="font-medium" htmlFor="input-topic-category">
                    Category
                  </label>
                  <FormControl size="small">
                    <Select
                      id="input-topic-category"
                      className="rounded-md bg-zinc-200 m-0"
                      value={categoryName}
                      onChange={(event) => {
                        setCategory(event.target.value);
                      }}
                    >
                      <MenuItem className="px-4" value="">
                        Select Category
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem
                          className="px-4"
                          key={category.id}
                          value={category.name}
                        >
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="my-4">
                  <label htmlFor="input-topic-body">Topics Body</label>
                  <Editor
                    apiKey="ar3bll71u5ai3pbp02zqh8epqj4guoge5sifne7wmu72mhwl"
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: "advlist lists link",
                      toolbar:
                        "undo redo | formatselect | bold italic | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | link",
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </div>

                <div className="mt-4 flex flex-col">
                  <label className="font-medium" htmlFor="input-topic-tags">
                    Tags
                  </label>
                  <FormControl size="small">
                    <Autocomplete
                      id="tags-autocomplete"
                      multiple
                      options={tags}
                      getOptionLabel={(option: string) => option}
                      onChange={(event, value) => setSelectedTags(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // label="Tags"
                          placeholder="Select Tags"
                          variant="outlined"
                        />
                      )}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
            <div id="submit-button" className="fixed right-8 bottom-4">
              <button
                id="btn-new-topic"
                className="h-14 px-5 rounded-md font-bold text-white"
                style={{ backgroundColor: "var(--redPantone)" }}
                type="submit"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default NewTopicForm;
