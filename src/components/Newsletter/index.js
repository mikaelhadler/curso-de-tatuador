import React, { useState } from "react"
import PropTypes from "prop-types"

import { Container, Send, Form } from "./style"
import { Section } from "../Section"
import { Input } from "../../styles/input"
import { newsletter } from "../../utils/texts"
import { Alert } from "../../utils/alert"
import { ERROR_TYPE } from "../../utils/constants"
import { sendMail } from "../../utils/send-mail"

export const Newsletter = ({ name: nameProp }) => {
  // Inputs state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsApp, setWhatsApp] = useState("")

  // Form state
  const [error, setError] = useState(false)
  const [errorType, setErrorType] = useState()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const disabled = success || loading

  const canRequest = () => name && (whatsApp || email)

  const encode = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((k)=>{
      formData.append(k,data[k])
    });
    return formData
  }

  const formTrigger = async event => {

    if (!canRequest()) {
      setErrorType(ERROR_TYPE.VALUES)
      return setError(true)
    }

    try {
      setLoading(true)
      const data = { "form-name": "contact", name, email, whatsApp }
      fetch("/", {
        method: "POST",
        // headers: { "Content-Type": 'multipart/form-data; boundary=random' },
        body: encode(data)
      })
        .then(() => console.log('deu certo'))
        .catch(error => console.log('deu ruim :('));
      setLoading(false)
      event.preventDefault()

      if (!success) {
        setErrorType(ERROR_TYPE.NETWORK)
        setLoading(false)
        return setError(true)
      }
      setSuccess(true)
      setError(false)
      clear()
    } catch {
      setErrorType(ERROR_TYPE.NETWORK)
      setLoading(false)
      return setError(true)
    }
  }

  const clear = () => {
    setName("")
    setEmail("")
    setWhatsApp("")
  }

  return (
    <Section title={newsletter.title} small={true}>
      <Container name={nameProp}>
        <Form onSubmit={formTrigger} form-name="contact" action="/thank-you">
          <Input
            disabled={disabled}
            placeholder={newsletter.name}
            type="text"
            value={name}
            name="name"
            onChange={({ target: { value } }) => setName(value)}
            required
          />
          <Input
            disabled={disabled}
            placeholder={newsletter.email}
            type="email"
            value={email}
            name="email"
            onChange={({ target: { value } }) => setEmail(value)}
          />
          <Input
            disabled={disabled}
            placeholder={newsletter.whatsapp}
            type="text"
            value={whatsApp}
            name="whatsApp"
            onChange={({ target: { value } }) => setWhatsApp(value)}
          />
          <Send disabled={disabled} as="button">
            {newsletter.send}
          </Send>
        </Form>
        {error && <Alert>{newsletter.error[errorType]}</Alert>}
        {success && <Alert>{newsletter.success}</Alert>}
      </Container>
    </Section>
  )
}

Newsletter.propTypes = {
  name: PropTypes.string,
}

Newsletter.defaultProps = {
  name: "",
}
