/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Stack, styled } from '@mui/material'
import Input from 'components/Input'
import Modal from 'components/Modal'
import TextArea from 'components/TextArea'
import useGlobal from 'hooks/useGlobal'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { postSchema } from 'schemas/post'
import { createPost, editPost } from 'services/post'
import { TSubmitPost } from 'types/post'
import { messageError, messageSuccess } from 'utils/toast'

interface PostFormProps {
  type?: 'create' | 'edit'
}

const StyledPostForm = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%'
}))

const PostForm = ({ type }: PostFormProps) => {
  const { toggleEditModal, handleGetPosts, username, currentPost } = useGlobal()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid }
  } = useForm<TSubmitPost>({ resolver: yupResolver(postSchema) })

  const onSubmit: SubmitHandler<TSubmitPost> = async (data) => {
    if (!username) return
    const body = {
      ...data,
      username,
      created_datetime: new Date().toISOString()
    }
    try {
      if (type === 'edit') {
        await editPost(currentPost.id, body)
        toggleEditModal()
        messageSuccess('Post was edited')
      } else {
        await createPost(body)
        messageSuccess('Post was created')
      }
      handleGetPosts()
      reset()
    } catch (error) {
      messageError('Post was not edited')
    }
  }

  useEffect(() => {
    if (type === 'edit') {
      reset({
        title: currentPost.title,
        content: currentPost.content
      })
    }
  }, [currentPost, type])

  return (
    <Modal
      title={type === 'edit' ? 'Edit item' : 'What’s on your mind?'}
      width={type === 'edit' ? 660 : undefined}
    >
      <StyledPostForm component='form' onSubmit={handleSubmit(onSubmit)}>
        <Input
          label='Title'
          placeholder='Hello world'
          {...register('title')}
          error={Boolean(errors.title)}
          helperText={errors.title?.message ?? ''}
        />
        <TextArea
          label='Content'
          placeholder='Content here'
          {...register('content')}
          error={Boolean(errors.content)}
          helperText={errors.content?.message ?? ''}
        />
        <Stack direction='row' justifyContent='flex-end' gap={2}>
          {type === 'edit' && (
            <Button variant='outlined' color='secondary' onClick={toggleEditModal}>
              Cancel
            </Button>
          )}
          <Button
            variant='contained'
            color={type === 'edit' ? 'success' : 'primary'}
            type='submit'
            disabled={!isDirty || !isValid}
          >
            {type === 'edit' ? 'Edit' : 'Create'}
          </Button>
        </Stack>
      </StyledPostForm>
    </Modal>
  )
}

export default PostForm
