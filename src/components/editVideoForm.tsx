import React, { useContext, useState } from "react";
import { ProcessedVideo } from "../common/interfaces";
import { updateVideo } from "../services/videos";
import { DatabaseContext } from "./databaseContext";
import { Form } from "./form";
import { Select } from "./inputs/select";
import { TextField } from "./inputs/textField";
import { validate } from "./inputs/validation";
import { Row } from "./row";
export interface EditVideoScreenProps {
    /** Already exisiting video. If not given, a new video will be created */
    video?: ProcessedVideo;
    onLeave: (cancel: boolean) => void;
}

export function EditVideoScreen(props: EditVideoScreenProps): JSX.Element {
    const VIDEO_NAME_FIELD = "name";
    const AUTHOR_FIELD = "author";
    const CATEGORIES_FIELD = "categories";

    const databaseContext = useContext(DatabaseContext);
    const { authors, categories, videos } = databaseContext;

    const [videoName, setVideoName] = useState<{ value: string | undefined }>({ value: props.video?.name });
    const [author, setAuthor] = useState<{ value: number | undefined }>({ value: props.video?.authorId });
    const [selectedCategories, setSelectedCategories] = useState<{ value: number[] }>({ value: props.video?.categoryIds || [] });

    const [errors, setErrors] = useState<{ [fieldName: string]: string | undefined }>({});
    const deleteError = (fieldName: string) => {
        if (errors[fieldName]) {
            delete errors[fieldName];
        }
    }

    const handleChangeVideoName = (event: React.ChangeEvent<{ name?: string, value: unknown }>) => {
        setVideoName({ value: event.target.value as string });
        deleteError(VIDEO_NAME_FIELD);
    };

    const handleChangeAuthor = (event: React.ChangeEvent<{ name?: string, value: unknown }>) => {
        setAuthor({ value: Number(event.target.value) });
        deleteError(AUTHOR_FIELD);
    };

    const handleChangeCategories = (event: React.ChangeEvent<{ name?: string, value: unknown }>) => {
        const value = event.target.value as unknown[];
        const newValue = Number(value[value.length - 1]);
        if (selectedCategories.value.indexOf(newValue) < 0) {
            setSelectedCategories({
                value: [...selectedCategories.value, newValue]
            });
        } else {
            setSelectedCategories({ value: selectedCategories.value.filter(c => c !== newValue) });
        }

        deleteError(CATEGORIES_FIELD);
    };

    const handleSubmit = () => {
        const inputValues = validateInputs();
        if (!inputValues) { return; }

        const updateVideoInformation = {
            catIds: inputValues.categories,
            name: inputValues.videoName || "",
            authorId: inputValues.authorId
        };

        updateVideo(
            props.video,
            updateVideoInformation,
            authors,
            videos,
        ).then(e => {
            // TODO: Proper Error handling
            if (e !== undefined) {
                console.log(e);
            }

            props.onLeave(false);
        });
    }

    const validateInputs = (): { authorId: number; videoName: string; categories: number[] } | undefined => {
        const errors = validate({
            inputs: [
                { fieldName: VIDEO_NAME_FIELD, required: true, value: videoName.value },
                { fieldName: AUTHOR_FIELD, required: true, value: author.value },
                { fieldName: CATEGORIES_FIELD, required: true, value: selectedCategories.value }
            ]
        })

        if (errors !== undefined) {
            setErrors(errors);
            return undefined;
        }

        return {
            authorId: author.value!,
            videoName: videoName.value!,
            categories: selectedCategories.value!
        }
    }

    return <Form
        headline={props.video === undefined ? "Add video" : `Edit video: ${props.video.name}`}
        onSubmitClick={handleSubmit}
        onCancelClick={() => props.onLeave(true)}
    >
        <Row label="Video Name">
            <TextField
                id="video-input"
                key="video-input"
                value={videoName.value || ""}
                onChange={handleChangeVideoName}
                errorText={errors[VIDEO_NAME_FIELD]}
            />
        </Row>
        <Row label="Video Name">
            <Select
                id="author-select"
                value={author.value || ""}
                onChange={handleChangeAuthor}
                items={authors}
                errorText={errors[AUTHOR_FIELD]}
            />
        </Row>
        <Row label="Categories">
            <Select
                id="categories-select"
                value={selectedCategories.value}
                onChange={handleChangeCategories}
                items={categories}
                errorText={errors[CATEGORIES_FIELD]}
                multiple
            />
        </Row>
    </Form>
}
