$(document).ready(function() {
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQemQjTYwk8ennm8gMjbHvhvXiizWmG6wFDDZLVg0N4WWOYA_89IezaYmArtSELCpQ08oIijABOZRiQ/pub?output=csv';

    $.get(CSV_URL, function(data) {
        const lines = data.split('\n');
        const waffles = {};
        const details = {}; // To store details

        // Parse the CSV data
        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(',');
            if (currentLine.length >= 3) { // Assuming details are in the third column
                const id = parseInt(currentLine[0], 10);
                const value = parseInt(currentLine[1], 10);
                const detail = currentLine[2].trim(); // Assuming "التفاصيل" is the third column
                
                if (!isNaN(id) && !isNaN(value)) {
                    waffles[id] = Math.min(value, 100);
                    details[id] = detail; // Store detail
                }
            }
        }

        // Create waffle blocks
        for (let i = 1; i <= 9; i++) {
            const value = waffles[i] || 0;
            const detailText = details[i] || "No details available"; // Default message

            const waffleWrapper = $('<div class="waffle-wrapper"></div>');
            const valueDisplay = $('<div class="value-display">٪ ' + value + '</div>');
            waffleWrapper.append(valueDisplay);

            const waffle = $('<div class="waffle"></div>');
            for (let j = 0; j < 100; j++) {
                const block = $('<div class="block"></div>');
                if (j < value) {
                    block.addClass('filled');
                }
                waffle.append(block);
            }

            const waffleId = $('<div class="waffle-id">القاعة رقم: ' + i + '</div>');
            waffleWrapper.append(waffle).append(waffleId);

            // Click event to show modal
            waffleWrapper.click(function() {
                $('#details-text').text(detailText);
                $('#myModal').css('display', 'block');
            });

            $('#waffle-container').append(waffleWrapper);
        }
        
        // Modal close
        $('.close').click(function() {
            $('#myModal').css('display', 'none');
        });

        // Close modal when clicking anywhere outside
        $(window).click(function(event) {
            if ($(event.target).is('#myModal')) {
                $('#myModal').css('display', 'none');
            }
        });
    }).fail(function() {
        console.error('Error fetching CSV data');
    });
});