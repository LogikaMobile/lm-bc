package mx.com.logikamobile.lmbc.presentation.dto

import kotlinx.serialization.Serializable

@Serializable
data class TicketResponse(
    val id: Int,
    val projectId: Int,
    val type: String,
    val status: String,
    val priority: String,
    val description: String,
    val createdAt: String
)
