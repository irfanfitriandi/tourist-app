import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import {
  useCreateTouristMutation,
  useGetTouristListQuery,
} from '@/app/services/api'
import { setToast } from '@/app/reducers/toast.slice'
import { useInfiniteScroll } from '@/hooks'

import {
  Button,
  CardForm,
  CardTourist,
  Header,
  InputForm,
  LoadingSpinner,
  Modal,
} from '@/components'
import { ErrorAPI, Tourist } from '@/utils/types'

const TouristList = () => {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [touristList, setTouristList] = useState<Tourist[]>([])
  const { data, isFetching } = useGetTouristListQuery(page, {
    refetchOnMountOrArgChange: true,
  })

  //Add Tourist
  const [modalAddTourist, setModalAddTourist] = useState(false)
  const [formTourist, setFormTourist] = useState({
    tourist_email: '',
    tourist_location: '',
    tourist_name: '',
  })
  const [addTourist] = useCreateTouristMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (data) {
      setTouristList(data.data)
      setTotalPages(data.total_pages)
    }
  }, [data])

  useInfiniteScroll({
    isFetching,
    totalPages,
    page,
    setPage,
  })

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFormTourist({
      ...formTourist,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addTourist(formTourist).then((res) => {
      const { data } = res as { data: Tourist }
      const { error } = res as ErrorAPI

      if (error) {
        dispatch(
          setToast({
            messageToast: `Add Tourist Failed`,
            statusToast: 'failed',
            showToast: true,
          }),
        )
      } else if (data) {
        dispatch(
          setToast({
            messageToast: `Add Tourist Success`,
            statusToast: 'success',
            showToast: true,
          }),
        )
        navigate(`/tourist/${data.id}`)
      }
    })
  }

  return (
    <div className="relative flex flex-col items-center bg-[url('/img/bg-1.webp')] bg-auto">
      <Header isFixed />
      <div className="mx-auto mt-20 grid max-w-[1200px] grid-cols-1 gap-4 bg-[#FFD05B] px-8 py-6 md:grid-cols-2">
        {touristList.map((data) => (
          <CardTourist key={data.id} data={data} />
        ))}

        {isFetching && <LoadingSpinner loadingPage={false} />}
      </div>

      {/* Add Tourist */}
      <button
        onClick={() => setModalAddTourist(!modalAddTourist)}
        className="fixed bottom-4 right-4 z-10 rounded-full bg-[#f4f2ed] p-2 shadow-md shadow-black/30"
      >
        <img src="/ic/add-user.svg" alt="add-user" className="my-1 ml-2 w-12" />
      </button>

      <Modal showModal={modalAddTourist} setShowModal={setModalAddTourist}>
        <CardForm title="Add Tourist" handleSubmit={handleSubmit}>
          <>
            <InputForm
              label="Name"
              placeholder="Name"
              type="text"
              name="tourist_name"
              value={formTourist.tourist_name}
              onChange={handleChange}
              required
            />
            <InputForm
              label="Location"
              placeholder="Location"
              type="text"
              name="tourist_location"
              value={formTourist.tourist_location}
              onChange={handleChange}
              required
            />
            <InputForm
              label="Email"
              placeholder="Email"
              type="email"
              name="tourist_email"
              value={formTourist.tourist_email}
              onChange={handleChange}
              required
            />

            <div className="flex flex-col gap-2 pt-10">
              <Button label="Add Tourist" sources="primary" type="submit" />
            </div>
          </>
        </CardForm>
      </Modal>
    </div>
  )
}

export default TouristList
